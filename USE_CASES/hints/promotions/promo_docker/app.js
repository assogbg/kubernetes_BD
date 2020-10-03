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
const PORT = 8080;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */


app.post('/getPromotions', function(req, res) {

  getPromotions(req,res);


});

//This route has been added in the docker image assogbg/pod_second:v2 but is not present in the v1
app.post('/setPromotions', function(req, res) {

    res.send('This is the hello world V2 for deployments')
});


var getPromotions = function(req,res) {

  var requestId         = req.body.requestId.toString()

  var userIdArray=[];
  for (var userId of req.body.userIds) {
      userIdArray.push(userId)
  }
  console.log(userIdArray)

  promoDb.UserPromotionModel.find().where("userId").in(userIdArray).exec(function(err, promos){
    if(err){
        console.log(err)
        res.setHeader('Content-Type', 'application/json');
        res.status(500).send({"errors":[err.message]});
    }
    console.log(promos);
    res.send(promos)

  })
};
