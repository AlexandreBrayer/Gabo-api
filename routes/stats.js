const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Rounds = require('../models/Round')
const Games = require('../models/Game')

function numberOfWin(id, games) {
    const gamesWon = games.filter(game => game.winner.equals(id))
    return gamesWon.length
}

function numberOfLoss(id, games) {
    const gamesLost = games.filter(game => game.loser.equals(id))
    return gamesLost.length
}

function numberOfGabos(id, rounds) {
    const gabos = rounds.filter(round => round.gabo.includes(id))
    return gabos.length
}

function numberOfLowPens(id, rounds) {
    const lowPens = rounds.filter(round => round.lowpen.includes(id))
    return lowPens.length
}

function numberOfHighPens(id, rounds) {
    const highPens = rounds.filter(round => round.highpen.includes(id))
    return highPens.length
}

function numberOfLowDownhills(id, rounds) {
    const lowDownhills = rounds.filter(round => round.lowDownhill.includes(id))
    return lowDownhills.length
}

function numberOfHighDownhills(id, rounds) {
    const highDownhills = rounds.filter(round => round.highDownhill.includes(id))
    return highDownhills.length
}

function totalScore(id, rounds) {
    const scores = rounds.filter(round => round.scores[id])
    return scores.reduce((acc, curr) => acc + curr.scores[id], 0)
}

function avgScorePerGame(id, games) {
    const scores = games.map(game => game.scores[game.scores.length - 1][id])
    return scores.reduce((acc, curr) => acc + curr, 0) / scores.length
}

router.get(['/', '/:id'], async(req, res) => {
    var id = req.params.id
    var user = null
    if (!id && req.headers.authorization) {
        user = await User.findOne({ token: req.headers.authorization })
        if (!user) {
            res.status(400).send({
                success: false,
                message: 'User not found'
            })
            return
        }
        id = user._id
    } else {
        res.status(400).send({
            success: false,
            message: 'User not found'
        })
        return
    }
    if (!user) {
        user = await User.findById(id)
    }
    if (!user) {
        res.status(400).send({
            success: false,
            message: 'User not found'
        })
        return
    }
    const games = await Games.find({
        _id: {
            $in: user.games
        }
    })
    var allRounds = []
    for (let i = 0; i < games.length; i++) {
        const rounds = await Rounds.find({
            _id: {
                $in: games[i].rounds
            }
        })
        allRounds = allRounds.concat(rounds)
    }

    res.status(200).send({
        success: true,
        stats: {
            wins: numberOfWin(id, games),
            losses: numberOfLoss(id, games),
            gabos: numberOfGabos(id, allRounds),
            lowPens: numberOfLowPens(id, allRounds),
            highPens: numberOfHighPens(id, allRounds),
            lowDownhills: numberOfLowDownhills(id, allRounds),
            highDownhills: numberOfHighDownhills(id, allRounds),
            totalGames: games.length,
            totalRounds: allRounds.length,
            totalScore: totalScore(id, allRounds),
            averageScore: totalScore(id, allRounds) / allRounds.length || 0,
            averageScorePerGame: avgScorePerGame(id, games) || 0
        }
    })
})

module.exports = router