const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Rounds = require('../models/Round')

router.post('/bulk', async(req, res) => {
    const { rounds } = req.body
    const user = await User.findOne({ token: req.headers.authorization })
    if (!user) {
        res.status(400).send({
            success: false,
            message: 'User not found'
        })
        return
    }
    try {
        const newRounds = await Rounds.insertMany(rounds)
        res.status(201).send({
            success: true,
            rounds: newRounds
        })
    } catch (err) {
        res.status(400).send({
            success: false,
            message: err.message
        })
    }
})

module.exports = router