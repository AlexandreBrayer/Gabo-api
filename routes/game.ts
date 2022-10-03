import express, { Request, Response } from "express";
const router = express.Router();
import User from "../models/User";
import Game from "../models/Game";

router.post("/", async (req: Request, res: Response) => {
  const user = await User.findOne({ token: req.headers.authorization });
  if (!user) {
    res.status(400).send({
      success: false,
      message: "User not found",
    });
    return;
  }
  const { game } = req.body;
  game.timestamp = Date.now();
  try {
    const newGame = await Game.create(game);
    await User.updateMany(
      { _id: { $in: game.players } },
      { $push: { games: newGame._id } }
    );
    res.status(201).send({
      success: true,
      game: newGame,
    });
  } catch (err: any) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

router.get("/mygames", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string|| "0");
  const user = await User.findOne({ token: req.headers.authorization });
  if (!user) {
    res.status(400).send({
      success: false,
      message: "User not found",
    });
    return;
  }
  try {
    const games = await Game.find({ _id: { $in: user.games } }, null, {
      skip: page * 10,
      limit: 10,
    })
      .sort({ timestamp: -1 })
      .populate("players", "-password -token -__v -email")
      .populate("rounds")
      .populate("winner", "-password -token -__v -email")
      .populate("loser", "-password -token -__v -email")
      .exec();

    res.status(200).send({
      success: true,
      games: games,
    });
  } catch (err: any) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findOne({ token: req.headers.authorization });
  if (!user) {
    res.status(400).send({
      success: false,
      message: "User not found",
    });
    return;
  }
  try {
    const game = await Game.findOne({ _id: req.params.id })
      .populate("players", "-password -token -games -__v -email")
      .populate("rounds")
      .populate("winner", "-password -token -__v -email")
      .populate("loser", "-password -token -__v -email")
      .exec();

    res.status(200).send({
      success: true,
      game: game,
    });
  } catch (err: any) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

export default router;
