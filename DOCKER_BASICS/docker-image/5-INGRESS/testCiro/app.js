'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var app = express();



/*
* Server definition
* */
const PORT = 7777;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

app.get('/', function(req, res) {

    res.send('This is the GREAT ciro di marzo API v4')
});

app.get('/getImmortale', function(req, res) {
  var clan=req.query.clan;
  res.send('sempre per noi ciro - clan '+clan)
})
