import express, { Request, Response } from "express";
const router = express.Router();
const User = require("../models/User");
var sha256 = require("js-sha256");

function genToken(): string {
  return (
    Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
  );
}

router.post("/register", async (req: Request, res: Response) => {
  const { name, password, email }: RegisterPayload = req.body;
  const token: string = genToken();
  const user = new User({
    name,
    password: sha256(password),
    token,
    email,
  });
  try {
    await user.save();
    res.status(201).send({
      success: true,
      token,
      name: user.name,
      userId: user._id,
    });
  } catch (err: any) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { name, password }: LoginPayload = req.body;
  try {
    const user = await User.findOne({ name: name });
    if (!user) {
      res.status(400).send({
        success: false,
        message: "User not found",
      });
    } else {
      if (!user.token) {
        user.token = genToken();
        await user.save();
      }
      if (user.password === sha256(password)) {
        res.status(200).send({
          success: true,
          token: user.token,
          name: user.name,
          userId: user._id,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Wrong password",
        });
      }
    }
  } catch (err: any) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

router.post("/tokenLogin", async (req: Request, res: Response) => {
  const { token }: { token?: string } = req.body;
  try {
    const user = await User.findOne({
      token,
    });
    if (!user) {
      res.status(400).send({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).send({
        success: true,
        token: user.token,
        name: user.name,
        userId: user._id,
      });
    }
  } catch (err: any) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

router.get("/", async (req: Request, res: Response) => {
  const token: string | undefined = req.headers.authorization;
  try {
    const user = await User.findOne({
      token,
    }).select("-password -token -__v -email");
    if (!user) {
      res.status(400).send({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).send({
        success: true,
        user: user,
      });
    }
  } catch (err: any) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select("-password -token -__v -email");
    res.status(200).send({
      success: true,
      users,
    });
  } catch (err: any) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  const { name } = req.query;
  try {
    const users = await User.find({
      name: {
        $regex: name,
        $options: "i",
      },
    })
      .select("-password -token -games -__v -email")
      .sort({ name: 1 })
      .limit(10);
    res.status(200).send({
      success: true,
      users: users,
    });
  } catch (err: any) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

export default router;
