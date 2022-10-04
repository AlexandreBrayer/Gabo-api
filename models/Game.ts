import {Schema, model} from "mongoose";
const { ObjectId } = require('bson');

const GameModel = new Schema<IGame>({
    players: {
        type: [ObjectId],
        ref: 'User',
        default: []
    },
    winner: {
        type: ObjectId,
        ref: 'User',
        default: null
    },
    loser: {
        type: ObjectId,
        ref: 'User',
        default: null
    },
    scores: {
        type: [Object],
        default: {}
    },
    rounds: {
        type: [ObjectId],
        ref: 'Round',
        default: []
    },
    timestamp: {
        type: Number,
        required: true
    }

}).set('toJSON', {
    virtuals: true
});

export default model('Game', GameModel);