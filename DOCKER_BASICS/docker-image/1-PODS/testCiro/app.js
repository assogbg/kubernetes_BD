'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var app = express();



/*
* Server definition
* */
const PORT = 7777;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

app.get('/hello', function(req, res) {

    res.send('This is the POD section exercices Hello world from ciro')
});

//This route has been added in the docker image assogbg/pod_second:v2 but is not present in the v1 
app.get('/hello/v2', function(req, res) {

    res.send('This is the hello world V2 for deployments')
});
