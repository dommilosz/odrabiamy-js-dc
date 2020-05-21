const secrets = require("./secrets.json"); // read the creds
const webserver = require("./Server/webserver.js"); // to serve the webserver
const endpoints = require("./endpoints");
const auth = require("./Server/auth-handler");
const opn = require("opn"); //to open a browser window
const bot = require('./DCBot/bot');

webserver.Create(21370); // create the webserver
auth.password = "onpm";

var StartArgs = process.argv.slice(2);
console.log("StartArgs: ", StartArgs);
api = require('./odrabiamy-pl.js')
api.GetCookie(secrets.username,secrets.password);

bot.Init();