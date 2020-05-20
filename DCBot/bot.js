const Discord = require('discord.js');
const bot = new Discord.Client();
const json = require('./klucz.json');

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.username}!`);
});

bot.login(json['token']);

bot.on('message', msg => {
    if(msg.content.startsWith('!')) {
        console.log('got a valid command');
        let wiad = msg.content.slice(1);
        let args = msg.content.split(/[ ]+/);
    }
})