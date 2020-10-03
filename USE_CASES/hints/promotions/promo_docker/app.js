'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var moment = require('moment-timezone');
moment.tz.setDefault('Europe/Brussels');
var express = require('express');
var _ = require('lodash');
var querystring = require("querystring");
var preanalysisDb = require('./dataBaseHelper');





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

    res.send('This is the POD section exercices Hello world from ciro')
});

//This route has been added in the docker image assogbg/pod_second:v2 but is not present in the v1
app.post('/setPromotions', function(req, res) {

    res.send('This is the hello world V2 for deployments')
});


var insertRawItems = function(req, res){


  var ts = moment().format("YYYY-MM-DD HH:mm:ss");
  var requestId = req.body.requestId;
  logs.saveLog("preanalysis","insertRawItems", "insertRawItems",req.body.requestId, "enterMethod", "insertRawItems", "enter API");

  // Upsert by oppo
  var promiseArr = _.map(req.body.metadataList, function (value, key){
    var query = {
                  "requestId": requestId,
                  oppo_dossier: value.oppo_dossier
                }
    // default value when missing targets_table
    //var prodTable = !_.isEmpty(value.products_table) ? value.products_table : null

    var prodTable = value.products_table ? value.products_table : null
    var isAdhoc=req.body.isAdhoc

    var newPromo = {
                        
                        "requestId":requestId,
                        "sys_insertDateTime": ts

                      }

    return new Promise((resolve, reject) => {
        preanalysisDb.preMetadataModel.findOneAndUpdate(query, newMetaData, {upsert:true}, function(err, result){
          if(err){
            reject(err);
          }
          else {
            //if(_.isEmpty(prodTable) && !isAdhoc){
            if(prodTable==null && !isAdhoc){
              reject("Non Adhoc Targeting opportunity requires products_table");
            }
            else {
              resolve();
            }
          }
        });
    });
  });
