'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var app = express();



/*
* Server definition
* */
const PORT = 80;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

app.get('/authParam/:user/:pw', function(req, res) {

console.log(req.params.user.toString())
console.log(req.params.pw.toString())

    console.log(req.headers);
    //var uName = req.params.user.toString();
    //var uPw = req.params.pw.toString();
    var uName = req.headers.user;
    var uPw = req.headers.password;
    authenticate(req,res,uName,uPw);
    //res.send('This is the GREAT ciro di marzo API v4')
});

app.get('/authHeader/', function(req, res) {


    var uName = req.headers.User;
    var uPw = req.headers.Password;
    authenticate(req,res,uName,uPw);
});


var authenticate = function(req,res,user,pw){
  if(user == "urlauth" && pw == "urlpw"){
    res.status(200).send("authorized");
  }else{
    res.status(404).send("wrong user/pw");
  }
}
