const Discord = require('discord.js');
const bot = new Discord.Client();
const json = require('./klucz.json');
const odrabiamy = require('../odrabiamy-pl.js');

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.username}!`);
});

module.exports.Init = function(){
    bot.login(json.token);
}

userdata ={};

bot.on('message', async function(msg) {
    if(msg.content.startsWith('!')) {
        if(msg.author.bot)return;
        console.log(`DCBOT VALID CMD: ${msg}`);
        let wiad = msg.content.slice(1).trim();
        let args = wiad.split(/[ ]+/);
        let cmd = args.shift();
        if(cmd.toLowerCase() === 'odrabiamy'||cmd.toLowerCase() === 'o') {
            console.log('got !odrabiamy');
            let przedmioty = Object.keys( odrabiamy.getALLBooks()).sort()
            let przedmioty_arr = {};
            let przedmioty_arrsend = []
            przedmioty.forEach(element => {
                if(!przedmioty_arr[element.split(' ').slice(1,1024).join(' ')])przedmioty_arr[element.split(' ').slice(1,1024).join(' ')]= [];
                przedmioty_arr[element.split(' ').slice(1,1024).join(' ')].push((element.split(' ').slice(0,1).join(' ')))
            });
            Object.keys( przedmioty_arr).forEach(el=>{
                przedmioty_arr[el].forEach(el2=>{
                    przedmioty_arrsend.push(`${el2} ${el}`)
                })
                
            })
            userdata[msg.author.id] = '!o';
            msg.channel.send(`!odrabiamy <@${msg.author.id}> \nWybierz Klase:  \`\`\`st\n${ przedmioty_arrsend.join('\n')} \`\`\`\n!c[hoose] <nazwa>`);
        }
        else if(cmd.toLowerCase() === 'choose'||cmd.toLowerCase() === 'c') {
            if(userdata[msg.author.id]&&userdata[msg.author.id]!='none'&&userdata[msg.author.id]!='')
            {
            args = args.join(" ");
            args = args.split(/[ ]+[|][ ]+/);
            let min = Math.ceil(0);
            let max = Math.floor(args.length)
            msg.channel.send(`Wybrano \`${args[Math.floor(Math.random() * (max - min) + min)]}\``)
            }
            //args[Math.floor(Math.random() * (min - max) + min)]
        }
        //else if() wsparcie dla innych komend
        else {
            msg.channel.send('Niepoprawna komenda, wspierane polecenia:\n- `!Odrabiamy [grade] [subject] [page] [example]`\n- `//TODO: !Odrabiamy list [grade]/[subject]`\n - `!Choose [arg1] | [arg2] | [arg3] ...`');
        }
    }
})
