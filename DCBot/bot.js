const Discord = require("discord.js");
const bot = new Discord.Client();
const json = require("./klucz.json");
const odrabiamy = require("../odrabiamy-pl.js");
const { error } = require("jquery");

bot.on("ready", () => {
	console.log(`Logged in as ${bot.user.username}!`);
});

module.exports.Init = function () {
	bot.login(json.token);
};

userdata = {};
userdata_prev = {};

bot.on("message", async function (msg) {
	if (msg.content.startsWith("!")) {
		if (msg.author.bot) return;
		console.log(`DCBOT VALID CMD: ${msg}`);
		let wiad = msg.content.slice(1).trim();
		let args = wiad.split(/[ ]+/);
		let cmd = args.shift();
		if (cmd.toLowerCase() === "odrabiamy" || cmd.toLowerCase() === "o") {
			console.log("got !odrabiamy");
			let przedmioty = Object.keys(odrabiamy.getALLBooks()).sort();
			let przedmioty_arr = {};
			let przedmioty_arrsend = [];
			przedmioty.forEach((element) => {
				if (
					!przedmioty_arr[element.split(" ").slice(1, 1024).join(" ")]
				)
					przedmioty_arr[
						element.split(" ").slice(1, 1024).join(" ")
					] = [];
				przedmioty_arr[
					element.split(" ").slice(1, 1024).join(" ")
				].push(element.split(" ").slice(0, 1).join(" "));
			});
			Object.keys(przedmioty_arr).forEach((el) => {
				przedmioty_arr[el].forEach((el2) => {
					przedmioty_arrsend.push(`${el2} ${el}`);
				});
			});
			userdata[msg.author.id] = [1, przedmioty_arrsend];
			msg.channel.send(
				`!odrabiamy <@${
					msg.author.id
				}> \nWybierz Klase:  \`\`\`st\n${przedmioty_arrsend.join(
					"\n"
				)} \`\`\`\n!c[hoose] <nazwa>`
			);
		} else if (
			cmd.toLowerCase() === "choose" ||
			cmd.toLowerCase() === "c"
		) {
			msg.channel.send(`<@${msg.author.id}>`);
			if (
				userdata[msg.author.id] &&
				userdata[msg.author.id] != "none" &&
				userdata[msg.author.id] != ""
			) {
				args = args.join(" ");
				args = args.split(/[ ]+[|][ ]+/);
				let min = Math.ceil(0);
				let max = Math.floor(args.length);
				let choosen = args[
					Math.floor(Math.random() * (max - min) + min)
				].trim();
				if (userdata[msg.author.id][1].includes(choosen)) {
					//sprawdz jezeli autor wiadomosci zainicjowal wczesniej !o
					msg.channel.send(`Wybrano \`${choosen}\``);
					if (userdata[msg.author.id][0] == 1) {
						//sprawdz czy uzytkownik jest swiezo po wpisaniu !o i wybiera klase
						let subj = Object.keys(
							odrabiamy.Ksiazki_Subjects[choosen]
						);
						let subj2 = Object.keys(
							odrabiamy.Ksiazki_Subjects[choosen]
						);
						subj.forEach((element, i) => {
							subj[i] = element;
							subj2[i] = "+ " + element;
						});
						userdata[msg.author.id] = [2, subj];
						userdata_prev[msg.author.id] = [];
						userdata_prev[msg.author.id].push(choosen);
						msg.channel.send(
							`Wybierz Przedmiot:  \`\`\`diff\n${subj2.join(
								"\n"
							)} \`\`\`\n!c[hoose] <nazwa>`
						);
					} else if (userdata[msg.author.id][0] == 2) {
						//sprawdz czy uzytkownik wybiera przedmiot
						books = odrabiamy.getBooksBySubject(
							userdata_prev[msg.author.id][0],
							choosen
						);
						books_arr = [];
						indexes = [];
						books.forEach((el, i) => {
							books_arr.push(`+ ${i} : ` + el.friendly_name);
							indexes.push(i);
						});
						userdata_prev[msg.author.id].push(choosen);
						userdata[msg.author.id] = [3, indexes];
						msg.channel.send(
							`Wybierz Ksiazke:  \`\`\`diff\n${books_arr.join(
								"\n"
							)} \`\`\`\n!c[hoose] <nazwa> (use ID)`
						);
					}
				} else if (userdata[msg.author.id][0] == 3) {
					//sprawdz czy uzytkownik wybiera ksiazke
					books = odrabiamy.getBooksBySubject(
						userdata_prev[msg.author.id][0],
						userdata_prev[msg.author.id][1]
					);
					book = books[choosen];
					userdata[msg.author.id] = [4, book.pages];
					userdata_prev[msg.author.id].push(choosen);
					msg.channel.send(
						`Wybierz Strone:  \`\`\`diff\n${book.pages.join(
							" "
						)} \`\`\`\n!c[hoose] <nazwa>`
					);
				} else if (userdata[msg.author.id][0] == 4) {
					//sprawdz czy uzytkownik wybiera strone
					books = odrabiamy.getBooksBySubject(
						userdata_prev[msg.author.id][0],
						userdata_prev[msg.author.id][1]
					);
					book = books[userdata_prev[msg.author.id][2]];
					exs = odrabiamy.getExList(book, choosen);
					towritearr = [];
					indexes = [];
					exs.forEach((el, i) => {
						towritearr.push(`+ ${i} : ` + el.number);
						indexes.push(i);
					});
					userdata[msg.author.id] = [5, indexes];
					userdata_prev[msg.author.id].push(choosen);
					msg.channel.send(
						`Wybierz Strone:  \`\`\`diff\n${towritearr.join(
							"\n"
						)} \`\`\`\n!c[hoose] <nazwa>`
					);
				} else {
					msg.channel.send(
						`ERROR 404. Co ty wpisales? \`${choosen}\``
					);
				}
			} else {
				msg.channel.send(`EJ EJ EJ. Czy ty wpisales \`!o[drabiamy]\`?`);
			}
			//args[Math.floor(Math.random() * (min - max) + min)]
		}
		else if (cmd.toLowerCase() === "back" || cmd.toLowerCase() === "b")
		{
			
		}
		//else if() wsparcie dla innych komend
		else {
			msg.channel.send(
				"Niepoprawna komenda, wspierane polecenia:\n- `!Odrabiamy [grade] [subject] [page] [example]`\n- `//TODO: !Odrabiamy list [grade]/[subject]`\n - `!Choose [arg1] | [arg2] | [arg3] ...`"
			);
		}
	}
});
