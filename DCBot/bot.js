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
        let args = wiad.split(/[ ]+/);
        let cmd = args.shift();
        if(cmd.toLowerCase()==='odrabiamy') {

        }
        //else if() wsparcie dla innych komend
        else {
            msg.channel.send('Niepoprawna komenda, wspierane polecenia:\n- Odrabiamy [args]');
        }
    }
})