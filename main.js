const bodyParser = require("body-parser")
const express = require('express')
const cors = require('cors');
const path = require('path')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors())

app.route('/*')
    .get(function(req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})