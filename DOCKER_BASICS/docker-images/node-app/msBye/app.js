'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var logger = require('morgan');




/*
* Server definition
* */
const PORT = 9999;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.use(logger("combined"));
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

app.get('/', function(req, res) {
   
  
    res.send('This is the root of ms bye - v3')
});

app.get('/sayByeToSomeone', function(req, res) {

    var msg={personToSayBye: req.query.personToSalute}
    res.send(msg);
});

app.post('/sayHelloToBye', function(req, res) {
  console.log("testBye MS + sayHelloToBye")

  console.log(req.body)


  var resMessage = req.body;
  resMessage.msgFromByeToHello = "MS Bye replies SEE YOU to MS Hello";

  res.send(resMessage);
});

/*
app.get('/svcPtTgtpt', function(req, res) {

  console.log("svcPtTgtpt in MSBYE - test port and targetPort combination no needs to specify ports  in curl towards msBye  ---- YOUHPU")
  res.send("youhouuuuu - svcPtTgtpt - port and targetPort combination no needs to specify ports  in curl towards msBye ")

})
*/