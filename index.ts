require('dotenv').config()
// const database = require('../database')
import {Database} from './database'
import cors from 'cors'
import bodyParser from "body-parser"
import express from 'express'
import path from 'path'
const database = new Database()
database.connect()
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors())

import userRoute from './routes/user'
app.use('/api/user', userRoute)

import roundRoute from './routes/rounds'
app.use('/api/rounds', roundRoute)

import gameRoute from './routes/game'
app.use('/api/game', gameRoute)

import statsRoute from './routes/stats'
app.use('/api/stats', statsRoute)

import guestRoute from './routes/guest'
app.use('/api/guest', guestRoute)

app.use(express.static('public'));

app.route('/*')
    .get(function(req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'), { extensions: ["js"] });
    });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})