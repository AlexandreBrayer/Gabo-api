const mongoose = require("mongoose");
const { ObjectId } = require("bson");

const UserModel = mongoose
  .Schema({
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
    },
    type: {
      type: String,
      default: "user",
    },
  })
  .set("toJSON", {
    virtuals: true,
  });
export default mongoose.model("User", UserModel);