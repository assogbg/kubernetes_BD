'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var app = express();



/*
* Server definition
* */
const PORT = 9999;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

app.get('/', function(req, res) {
    res.send('This is the ONLY ONE pietro savastano v4')
});
app.get('/getGennaro', function(req, res) {
  res.send('ho Capito Genna')
})
