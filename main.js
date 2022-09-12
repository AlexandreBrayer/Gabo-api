require('dotenv').config()
const database = require('./database')
database.connect()
const bodyParser = require("body-parser")
const express = require('express')
const cors = require('cors');
const path = require('path')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors())

const userRoute = require('./routes/user')
app.use('/api/user', userRoute)

const roundRoute = require('./routes/rounds')
app.use('/api/rounds', roundRoute)

const gameRoute = require('./routes/game')
app.use('/api/game', gameRoute)

const statsRoute = require('./routes/stats')
app.use('/api/stats', statsRoute)

const guestRoute = require('./routes/guest')
app.use('/api/guest', guestRoute)

app.use(express.static('public'));

app.route('/*')
    .get(function(req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'), { extensions: ["js"] });
    });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})