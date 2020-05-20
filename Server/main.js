// imports
var EventEmitter = require('events'); 
const webserver = require("./webserver.js"); // to serve the webserver
const authhandler = require("./auth-handler.js"); // to serve the webserver
const endpoints = require("../endpoints.js"); // to serve the webserver
const opn = require("opn"); //to open a browser window
const listener = new EventEmitter();
const backlistener = new EventEmitter();

// create the webserver
authhandler.password = 'onpm';
webserver.port = '21370';
webserver.Create();