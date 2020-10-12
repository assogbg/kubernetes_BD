'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
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
const PORT = 8080;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

// Route for retrieving all the promotions not used by a client
app.post('/getPromotions', function(req, res) {
  getPromotions(req,res);
});

//This route has been added in the docker image assogbg/pod_second:v2 but is not present in the v1
app.post('/setPromotions', function(req, res) {

    res.send('This is the hello world V2 for deployments')
});

//Get unused Promotions for a list of userIds
var getPromotions = function(req,res) {
  var requestId         = req.body.requestId.toString()

  var userIdArray=[];
  for (var userId of req.body.userIds) {
      userIdArray.push(userId)
  }
  console.log(userIdArray)

  promoDb.UserPromotionModel.find({"used": false}).where("userId").in(userIdArray).exec(function(err, promos){
    if(err){
        console.log(err)
        res.setHeader('Content-Type', 'application/json');
        res.status(500).send({"errors":[err.message]});
    }

    var logs = {
      "requestId": req.body.requestId,
      "api": "/getPromotions",
      "value": req.body.userIds
    }

    saveLogs(promos, logs, function(err){
      res.send(promos)
    });
  })
};


var saveLogs = function(data,log, callback){

  var headers={
    "Cache-Control": "no-cache",
    "Content-Type": "application/json"
  }
  var options = {
    url: 'http://promo-logging:8000/logging',
    method: 'POST',
    headers: headers,
    body: JSON.stringify(log)
  }

  request(options,function(err, response, body){
    callback(err);
  });
}
