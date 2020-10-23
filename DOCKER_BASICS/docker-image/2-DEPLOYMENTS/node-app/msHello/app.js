'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var request = require("request");
var logger = require('morgan');

var app = express();



/*
* Server definition
* */
const PORT = 7777;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.use(logger("combined"));
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);


/*
* Route definition
* */

app.get('/', function(req, res) {

    res.send('This is the hello world from ms hello - V3')
});

app.get('/sayHelloToSomeone', function(req, res) {

    var msg={personToSayHello: req.query.personToSalute}
    res.send(msg);
});

/*
app.get('/svcPtTgtpt', function(req, res) {

  console.log("svcPtTgtpt in msMorning - test port and targetPort combination in such a way that no needs to specify ports  in curl towards msBye")
  var options = {
                  url: 'http://ms-bye-svc/svcPtTgtpt',
                  method: 'GET'
                }
  request(options, function (err, response, body) {
    res.send(body);
  });

})

app.get('/contactByeFromHello', function(req, res) {

  var type=req.query.svcDiscovery;
  console.log("contactByeFromHello - req.query.svcDiscovery "+type)

  if(type=="DNS"){
    console.log("contactByeFromHello + dns")
    console.log("url is the same as the service name http://ms-bye-svc")
    var options = {
                    url: 'http://ms-bye-svc:'+process.env.MS_BYE_SVC_SERVICE_PORT+'/sayHelloToBye',
                    method: 'POST',
                    json: true,
                    body:{
                      msgFromHelloToBye: "MS Hello says HELLLOOO to MS GoodBye",
                      serviceDiscovery: "kubernetes DNS using the service name : http://ms-bye-svc"
                    }
                  }
    request(options, function (err, response, bodyResponse) {
      console.log("bodyResponse")
      console.log(bodyResponse)
      res.send(bodyResponse);
    });
  }else{
    console.log("contactByeFromHello + ENVVAR")
    console.log("url is the process.env.TEST_BYE_SVC_SERVICE_HOST :" + process.env.MS_BYE_SVC_SERVICE_HOST)
    var options = {
                    url: 'http://'+process.env.MS_BYE_SVC_SERVICE_HOST+':'+process.env.MS_BYE_SVC_SERVICE_PORT+'/sayHelloToBye',
                    method: 'POST',
                    json: true,
                    body:{
                      msgFromHelloToBye: "MS Hello says HELLLOOO to MS GoodBye",
                      serviceDiscovery: "Environment variable TEST_BYE_SVC_SERVICE_HOST: "+process.env.MS_BYE_SVC_SERVICE_HOST
                    }
                  }
    request(options, function (err, response, bodyResponse) {
      console.log("bodyResponse")
      console.log(bodyResponse)
      res.send(bodyResponse);
    });
  }

})
*/;
