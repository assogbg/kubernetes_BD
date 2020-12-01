'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var app = express();



/*
* Server definition
* */
const PORT = 9999;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* Route definition
* */

app.get('/world', function(req, res) {
    res.send('This is the PODS exercices section hello world from savastano')
});

//This route has been added in the docker image assogbg/pod_first:v2 but is not present in the v1 
app.get('/world/v2', function(req, res) {

    res.send('This is the hello world V2 for deployments')
});
