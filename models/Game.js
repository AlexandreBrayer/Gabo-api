const mongoose = require('mongoose');
const { ObjectId } = require('bson');

const GameModel = mongoose.Schema({
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
    looser: {
        type: ObjectId,
        ref: 'User',
        default: null
    },
    scores: {
        type: [Object],
        default: []
    },
    rounds: {
        type: [ObjectId],
        ref: 'Round',
        default: []
    }

}).set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Games', GameModel);