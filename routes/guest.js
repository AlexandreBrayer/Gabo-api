const express = require('express')
const router = express.Router()
const User = require('../models/User')
var sha256 = require('js-sha256')

function createOneTimePassword() {
    return Math.floor(Math.random() * 100000).toString().padStart(5, '0')
}

router.post('/', async(req, res) => {
    const { name, email } = req.body
    const user = new User({
        name,
        email,
        type: 'guest',
        password: sha256(createOneTimePassword())
    })
    try {
        await user.save()
        res.status(201).send({
            success: true,
            user: user
        })
    } catch (err) {
        res.status(400).send({
            success: false,
            message: err.message
        })
    }
})

module.exports = router;