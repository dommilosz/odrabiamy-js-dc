const Discord = require('discord.js');
const bot = new Discord.Client();
const json = require('./klucz.json');
const odrabiamy = require('../odrabiamy-pl.js');

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.username}!`);
});

bot.login(json['token']);

bot.on('message', msg => {
    if(msg.content.startsWith('!')) {
        console.log('got a valid command');
        let wiad = msg.content.slice(1).trim();
        let args = wiad.split(/[ ]+/);
        let cmd = args.shift();
        if(cmd.toLowerCase() === 'odrabiamy') {
            console.log('got !odrabiamy');
            msg.channel.send('odebrano !odrabiamy');
            odrabiamy.getBooksBySubject(args[0], args[1])
        }
        //else if() wsparcie dla innych komend
        else {
            msg.channel.send('Niepoprawna komenda, wspierane polecenia:\n- `!Odrabiamy [grade] [subject] [page] [example]`');
        }
    }
})