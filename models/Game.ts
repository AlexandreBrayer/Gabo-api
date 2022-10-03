import {Schema, model} from "mongoose";
const { ObjectId } = require('bson');

const GameModel = new Schema<IGame>({
    players: {
        type: [ObjectId],
        ref: 'Users',
        default: []
    },
    winner: {
        type: ObjectId,
        ref: 'Users',
        default: null
    },
    loser: {
        type: ObjectId,
        ref: 'Users',
        default: null
    },
    scores: {
        type: [Object],
        default: {}
    },
    rounds: {
        type: [ObjectId],
        ref: 'Rounds',
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