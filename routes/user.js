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
    const { name, password } = req.body
    try {
        //find by name or email
        const user = await User.findOne({
            $or: [{
                name: name
            }, {
                email: name
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

router.get('/', async(req, res) => {
    const token = req.headers.authorization
    try {
        const user = await User.findOne({
            token
        }).select('-password -token -__v -email')
        if (!user) {
            res.status(400).send({
                success: false,
                message: 'User not found'
            })
        } else {
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

router.get('/all', async(req, res) => {
    try {
        const users = await User.find({}).select('-password -token -__v -email')
        res.status(200).send({
            success: true,
            users
        })
    } catch (err) {
        res.status(400).send({
            success: false,
            message: err.message
        })
    }
})

router.get('/search', async(req, res) => {
    const { name } = req.query
    try {
        const users = await User.find({
            name: {
                $regex: name,
                $options: 'i'
            }
        }).select('-password -token -games -__v -email')
        res.status(200).send({
            success: true,
            users: users
        })
    } catch (err) {
        console.log(err)
        res.status(400).send({
            success: false,
            message: err.message
        })
    }
})

module.exports = router;