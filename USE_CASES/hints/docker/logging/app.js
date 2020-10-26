'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var dateFormat = require('dateformat');
var moment = require('moment-timezone');
moment.tz.setDefault('Europe/Brussels');
var express = require('express');
var querystring = require("querystring");
var _ = require("lodash");
var promoDb = require('./databaseHelper');



/*
* Server definition
* */

var app =  express();
const PORT = 8000;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

// Route for retrieving all the promotions not used by a client
app.post('/logging', function(req, res) {
  saveLogs(req,res);
});


//Get unused Promotions for a list of userIds
var saveLogs = function(req,res) {

  var ts = moment().format("YYYY-MM-DD HH:mm:ss");

  var logs = new promoDb.UserLoggingModel({
      "requestId": req.body.requestId,
      "api": req.body.api,
      "value": req.body.value.toString(),
      "sys_insertDateTime": ts
  });
    console.log("logs to save")
    console.log(logs)

  logs.save(function(err, doc){
    if(err){
        console.log(err)
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send({"errors":[err.message]});
    }
    else {
        res.send("success")
      }
  })

};
