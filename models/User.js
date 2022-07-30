const mongoose = require('mongoose');
const { ObjectId } = require('bson');

const UserModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    games: {
        type: [ObjectId],
        ref: 'Game',
        default: []
    },
    token: {
        type: String,
    }
}).set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Users', UserModel);