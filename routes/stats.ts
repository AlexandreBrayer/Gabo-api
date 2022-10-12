import express, { Request, Response } from "express";
import User from "../models/User";
import Stat from "../models/Stat";

const router = express.Router();

router.get(["/", "/:id"], async (req: Request, res: Response) => {
    var id = req.params.id;
    var user = null;
    if (!id && req.headers.authorization) {
        user = await User.findOne({ token: req.headers.authorization });
        if (!user) {
            res.status(400).send({
                success: false,
                message: "User not found",
            });
            return;
        }
        id = user._id.toString();
    } else {
        res.status(400).send({
            success: false,
            message: "User not found",
        });
        return;
    }
    if (!user) {
        user = await User.findById(id);
    }
    if (!user) {
        res.status(400).send({
            success: false,
            message: "User not found",
        });
        return;
    }

    const stats = await Stat.findById(user.stats);
    if (!stats) {
        res.status(400).send({
            success: false,
            message: "Stats not found",
        });
        return;
    }
    
    res.status(200).send({
        success: true,
        stats: {
            wins: stats.wins,
            losses: stats.losses,
            gabos: stats.gabo,
            lowPens: stats.lowpen,
            highPens: stats.highpen,
            lowDownhills: stats.lowDownhill,
            highDownhills: stats.highDownhill,
            totalGames: stats.games,
        },
    });
});

export default router;
