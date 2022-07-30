const express = require('express')
const router = express.Router()
const User = require('../models/User')
var sha256 = require('js-sha256')

function genToken() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
}

router.post('/register', async(req, res) => {
    const { name, password, email } = req.body
    const token = genToken()
    const user = new User({
        name,
        password: sha256(password),
        token,
        email
    })
    try {
        await user.save()
        res.status(201).send({
            success: true,
            token,
            name: user.name,
            userId: user._id
        })
    } catch (err) {
        res.status(400).send({
            success: false,
            message: err.message
        })
    }
})

router.post('/login', async(req, res) => {
    const { name, email, password } = req.body
    try {
        //find by name or email
        const user = await User.findOne({
            $or: [{
                name
            }, {
                email
            }]
        })
        if (!user) {
            res.status(400).send({
                success: false,
                message: 'User not found'
            })
        } else {
            if (user.password === sha256(password)) {
                res.status(200).send({
                    success: true,
                    token: user.token,
                    name: user.name,
                    userId: user._id
                })
            } else {
                res.status(400).send({
                    success: false,
                    message: 'Wrong password'
                })
            }
        }
    } catch (err) {
        res.status(400).send({
            success: false,
            message: err.message
        })
    }
})

router.post('/tokenLogin', async(req, res) => {
    const { token } = req.body
    try {
        const user = await User.findOne({
            token
        })
        if (!user) {
            res.status(400).send({
                success: false,
                message: 'User not found'
            })
        } else {
            res.status(200).send({
                success: true,
                token: user.token,
                name: user.name,
                userId: user._id
            })
        }
    } catch (err) {
        res.status(400).send({
            success: false,
            message: err.message
        })
    }
})

module.exports = router;