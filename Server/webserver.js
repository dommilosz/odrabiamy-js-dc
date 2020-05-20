//this module exposes functions and variables to control the HTTP server.
const http = require("http"); //to serve the pages
module.exports.server = require('express')();
module.exports.port = 8080;
const fs = require("fs"); //to read the webpages from disk

module.exports.Create = function(port){
	this.port = port;
	module.exports.server.listen(this.port);
}

module.exports.GetParams = function(req){
	url = req.originalUrl
	params = {};
	url.split("?").slice(1,1024).forEach(element => {
		params[element.split('=')[0]] =  decodeURI(element.split('=')[1]);
	});
	return params
}





