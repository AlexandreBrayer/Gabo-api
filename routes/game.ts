import express, { Request, Response } from "express";
import { ObjectId } from "bson";
const router = express.Router();
import User from "../models/User";
import Game from "../models/Game";
import Stat from "../models/Stat";
import Round from "../models/Round";

async function updateStats(gameId: ObjectId, userId: ObjectId) {
    const game = await Game.findById(gameId);
    const user = await User.findById(userId);
    if (!game || !user) {
        return;
    }
    const stats = await Stat.findById(user.stats);
    if (!stats) {
        return;
    }
    if (game.winner === user._id) {
        stats.wins++;
    } else if (game.loser === user._id) {
        stats.losses++;
    }
    stats.games++;
    stats.rounds += game.rounds.length;
    console.log(game.scores);
    const score = game.scores[game.scores.length - 1];
    const userScore = score[userId.toString()];
    stats.totalScore += userScore;
    for (const roundId of game.rounds) {
        const round = await Round.findById(roundId);
        if (!round) {
            continue;
        }
        if (round.gabo.includes(userId)) {
            stats.gabo++;
        }
        if (round.lowpen.includes(userId)) {
            stats.lowpen++;
        }
        if (round.contreGabo.includes(userId)) {
            stats.contreGabo++;
        }
        if (round.highpen.includes(userId)) {
            stats.highpen++;
        }
        if (round.lowDownhill.includes(userId)) {
            stats.lowDownhill++;
        }
        if (round.highDownhill.includes(userId)) {
            stats.highDownhill++;
        }
    }
    await stats.save();
}

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
        //update stats for each player
        for (const player of game.players) {
            await updateStats(newGame._id, player);
        }
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
    const page = parseInt((req.query.page as string) || "0");
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
