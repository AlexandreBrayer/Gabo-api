import { Schema, model } from "mongoose";
import { ObjectId } from "bson";
const RoundModel = new Schema<IRound>({
    players: {
        type: [ObjectId],
        ref: "User",
        default: [],
    },
    scores: {
        type: Object,
    },
    gabo: {
        type: [ObjectId],
        ref: "User",
        default: [],
    },
    lowpen: {
        type: [ObjectId],
        ref: "User",
        default: [],
    },
    contreGabo: {
        type: [ObjectId],
        ref: "User",
        default: null,
    },
    highpen: {
        type: [ObjectId],
        ref: "User",
        default: [],
    },
    lowDownhill: {
        type: [ObjectId],
        ref: "User",
        default: [],
    },
    highDownhill: {
        type: [ObjectId],
        ref: "User",
        default: [],
    },
}).set("toJSON", {
    virtuals: true,
});

export default model("Round", RoundModel);
