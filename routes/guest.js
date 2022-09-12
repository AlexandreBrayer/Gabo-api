const express = require('express')
const router = express.Router()
const User = require('../models/User')
var sha256 = require('js-sha256')

function createOneTimePassword() {
    return Math.floor(Math.random() * 100000).toString().padStart(5, '0')
}

router.post('/', async(req, res) => {
    const { name, email } = req.body
    const otp = createOneTimePassword()
    const user = new User({
        name,
        email,
        type: 'guest',
        password: sha256(otp)
    })
    try {
        await user.save()
        res.status(201).send({
            success: true,
            user: user,
            otp: otp
        })
    } catch (err) {
        res.status(400).send({
            success: false,
            message: err.message
        })
    }
})


router.post('/toUser', async(req, res) => {
    const { otp, password } = req.body
    try {
        const user = await User.findOne({
            password: sha256(otp)
        })

        if (!user) {
            res.status(400).send({
                success: false,
                message: 'User not found'
            })
        } else {
            user.password = sha256(password)
            user.type = 'user'
            await user.save()
            res.status(200).send({
                success: true,
                user: user
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