'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var request = require("request");
var logger = require('morgan');

var app = express();



/*
* Server definition
* */
const PORT = 1234;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.use(logger("combined"));
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

app.get('/', function(req, res) {

    res.send('This is the good morning root- v3')
});

app.get('/contactAfternoon', function(req, res) {

  console.log("contactAfternoon in msMorning")
  var options = {
                  url: 'http://localhost:4321/replyToMorning',
                  method: 'GET'
                }
  request(options, function (err, response, body) {
    res.send(body);
  });

})
