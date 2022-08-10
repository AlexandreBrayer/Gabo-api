const mongoose = require('mongoose');
const { ObjectId } = require('bson');

const GameModel = mongoose.Schema({
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
        default: Date.now()
    }

}).set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Games', GameModel);