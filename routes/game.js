const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Game = require('../models/Game')

router.post('/', async(req, res) => {
    const user = await User.findOne({ token: req.headers.authorization })
    if (!user) {
        res.status(400).send({
            success: false,
            message: 'User not found'
        })
        return
    }
    const { game } = req.body
    try {
        const newGame = await Game.create(game)
        await User.updateMany({ _id: { $in: game.players } }, { $push: { games: newGame._id } })
        res.status(201).send({
            success: true,
            game: newGame
        })
    } catch (err) {
        res.status(400).send({
            success: false,
            message: err.message
        })
    }
});

router.get('/mygames', async(req, res) => {
    const user = await User.findOne({ token: req.headers.authorization })
    if (!user) {
        res.status(400).send({
            success: false,
            message: 'User not found'
        })
        return
    }
    try {
        const games = await Game
            .find({ _id: { $in: user.games } })
            .sort({ date: -1 })
            .populate('players', '-password -token -games -__v -email')
            .populate('rounds')
            .populate('winner')
            .populate('loser')
            .exec()

        res.status(200).send({
            success: true,
            games: games
        })
    } catch (err) {
        res.status(400).send({
            success: false,
            message: err.message
        })
    }
})

router.get('/:id', async(req, res) => {
    const user = await User.findOne({ token: req.headers.authorization })
    if (!user) {
        res.status(400).send({
            success: false,
            message: 'User not found'
        })
        return
    }
    try {
        const game = await Game
            .findOne({ _id: req.params.id })
            .populate('players', '-password -token -games -__v -email')
            .populate('rounds')
            .populate('winner')
            .populate('loser')
            .exec()

        res.status(200).send({
            success: true,
            game: game
        })
    } catch (err) {
        res.status(400).send({
            success: false,
            message: err.message
        })
    }
})

//dev only
router.get('/clearGames', async(req, res) => {
    const users = await User.find({})
    users.forEach(async(user) => {
        await User.updateOne({ _id: user._id }, { $set: { games: [] } })
    })
    await Game.deleteMany({})
    res.status(200).send({
        success: true,
        message: 'Games cleared'
    })
});

module.exports = router