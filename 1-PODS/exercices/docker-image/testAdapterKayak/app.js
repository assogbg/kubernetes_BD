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
    res.send('This is the testAdapterKayak')
});
app.get('/formatCarInfo', function(req, res) {
  console.log("req kayak");
  var result = {
    carid:req.query.carid,
    price:55,
    currency:"euro",
    status:"available",
    message:"welcome to kayak",
    payment_method:"visa"
  }
  res.send(result)
})
