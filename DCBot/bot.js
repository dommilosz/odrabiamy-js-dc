const Discord = require('discord.js');
const bot = new Discord.Client();
const json = require('./klucz.json');
const odrabiamy = require('../odrabiamy-pl.js');

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.username}!`);
});

bot.login(json['token']);

bot.on('message', async function(msg) {
    if(msg.content.startsWith('!')) {
        console.log('got a valid command');
        let wiad = msg.content.slice(1).trim();
        let args = wiad.split(/[ ]+/);
        let cmd = args.shift();
        if(cmd.toLowerCase() === 'odrabiamy') {
            console.log('got !odrabiamy');
            msg.channel.send('odebrano !odrabiamy');
            let ksiazki = odrabiamy.getBooksBySubject(args[0], args[1]);
            for(var item in JSON.stringify(ksiazki).match(/[\s\S]{1,1500}/g).toString())
            //let strony = odrabiamy.getPagesOfBook(ksiazki);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        else if(cmd.toLowerCase() === 'choose') {
            args = args.join(" ");
            args = args.split(/[ ]+[|][ ]+/);
            let min = Math.ceil(0);
            let max = Math.floor(args.length)
            msg.channel.send(`Wybrano \`${args[Math.floor(Math.random() * (max - min) + min)]}\``)
            //args[Math.floor(Math.random() * (min - max) + min)]
        }
        //else if() wsparcie dla innych komend
        else {
            msg.channel.send('Niepoprawna komenda, wspierane polecenia:\n- `!Odrabiamy [grade] [subject] [page] [example]`\n- `//TODO: !Odrabiamy list [grade]/[subject]`\n - `!Choose [arg1] | [arg2] | [arg3] ...`');
        }
    }
})
