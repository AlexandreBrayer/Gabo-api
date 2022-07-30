const mongoose = require('mongoose');
const { ObjectId } = require('bson');

const RoundModel = mongoose.Schema({
    players: {
        type: [ObjectId],
        ref: 'User',
        default: []
    },
    scores: {
        type: Object,
    },
    gabo: {
        type: [ObjectId],
        ref: 'User',
        default: []
    },
    lowpen: {
        type: [ObjectId],
        ref: 'User',
        default: []
    },
    contreGabo: {
        type: ObjectId,
        ref: 'User',
        default: null
    },
    highpen: {
        type: [ObjectId],
        ref: 'User',
        default: []
    },
    downhill: {
        type: [ObjectId],
        ref: 'User',
        default: []
    }

}).set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Rounds', RoundModel);