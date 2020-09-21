'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var app = express();



/*
* Server definition
* */
const PORT = 33;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

app.get('/', function(req, res) {
    res.send("test main booking app")
});

app.get('/bookCar', function(req, res) {
  //id of an available car


  var carid="1-XXX-333"
  var options = {
                  url: 'http://localhost:9095/formatCarInfo?carid='+carid,
                  method: 'GET'
                }
  request(options, function (err, response, body) {
    res.send(body);
  });

})
