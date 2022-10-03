import express, { Request, Response } from "express";
import User from "../models/User";
const router = express.Router();
var sha256 = require("js-sha256");

function createOneTimePassword() : string {
  return Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
}

function genToken() : string {
  return (
    Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
  );
}

router.post("/", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const otp = createOneTimePassword();
  const user = new User({
    name,
    email,
    type: "guest",
    password: sha256(otp),
    token: genToken(),
  });
  try {
    await user.save();
    res.status(201).send({
      success: true,
      user: user,
      otp: otp,
    });
  } catch (err: any) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

router.post("/toUser", async (req, res) => {
  const { otp, password } = req.body;
  try {
    const user = await User.findOne({
      password: sha256(otp),
    });

    if (!user) {
      res.status(400).send({
        success: false,
        message: "User not found",
      });
    } else {
      user.password = sha256(password);
      user.type = "user";
      user.token = genToken();
      await user.save();
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

export default router;
