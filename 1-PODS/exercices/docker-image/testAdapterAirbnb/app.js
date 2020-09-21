'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var app = express();



/*
* Server definition
* */
const PORT = 9095;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

app.get('/', function(req, res) {
    res.send('This is the testAdapterAirbnb')
});
app.get('/formatCarInfo', function(req, res) {
  console.log("req airbnb");
  var result = {
    carid:req.query.carid,
    status:"available",
    costs:"10 euros an hour",
    payment_method:"paypal airbnb"
  }
  res.send(result)
})
