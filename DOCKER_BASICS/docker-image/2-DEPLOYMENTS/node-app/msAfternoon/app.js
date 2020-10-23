'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var request = require("request");
var logger = require('morgan');

var app = express();



/*
* Server definition
* */
const PORT = 4321;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.use(logger("combined"));
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

app.get('/', function(req, res) {

    res.send('This is the good afternoon root - v3')
});

app.get('/replyToMorning', function(req, res) {

  res.send("container morning successfully contacted container afternoon")
})
