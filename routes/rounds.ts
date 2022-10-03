import express, { Request, Response } from "express";
const router = express.Router();
import User from "../models/User";
import Rounds from "../models/Round";

router.post("/bulk", async (req: Request, res: Response) => {
  const { rounds } = req.body;
  const user = await User.findOne({ token: req.headers.authorization });
  if (!user) {
    res.status(400).send({
      success: false,
      message: "User not found",
    });
    return;
  }
  try {
    const newRounds = await Rounds.insertMany(rounds);
    res.status(201).send({
      success: true,
      rounds: newRounds,
    });
  } catch (err: any) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

export default router;
