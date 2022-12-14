import { Schema, model } from "mongoose";
import { ObjectId } from "bson";

const UserModel = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    games: {
        type: [ObjectId],
        ref: "Game",
        default: [],
    },
    token: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "user",
    },
    stats: {
        type: ObjectId,
        ref: "Stat",
        default: null,
    },
}).set("toJSON", {
    virtuals: true,
});

export default model("User", UserModel);
