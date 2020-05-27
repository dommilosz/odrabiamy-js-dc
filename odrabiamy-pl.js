var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
module.exports.JSON_RESP = {};
module.exports.Ksiazki = {};
module.exports.Ksiazki_Subjects = {};


module.exports.REQ_GET = function REQ_GET(url) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false); // false for synchronous request
	xmlHttp.send(null);
	return xmlHttp.responseText;
};

module.exports.REQ_POST = function REQ_POST(url, body, headers) {
	var data = body;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.open("POST", url, false);
	headers.forEach((element) => {
		xhr.setRequestHeader(element[0], element[1]);
	});
	if (typeof data == "object") data = JSON.stringify(data);
	xhr.send(data);
	return JSON.parse(xhr.responseText);
};
module.exports.GetData = function (){
	this.JSON_RESP = JSON.parse( this.REQ_GET('https://odrabiamy.pl/api/v1.3/ksiazki'));
	this.JSON_RESP.forEach(el=>{
		
		var donegrades = [];
		var grades = el.grades;
		var subj = el.subject;

		grades.forEach(el2=>{
			if(!this.Ksiazki[el2]){
				this.Ksiazki[el2] = [];
			}
			if(!donegrades.includes(el2))
			{
			this.Ksiazki[el2].push(el);
			donegrades.push(el2);
			if(!this.Ksiazki_Subjects[el2])this.Ksiazki_Subjects[el2] = {}
			if(!this.Ksiazki_Subjects[el2][subj]){
				this.Ksiazki_Subjects[el2][subj] = [];
			}
			this.Ksiazki_Subjects[el2][subj].push(el)
			}
		})

		

	})
	

}

this.GetData();
module.exports.getBookByID = function(klasa,id){
	var matching = ''; 
	this.Ksiazki[klasa].forEach(el=>{
		if(el.id == parseInt( id)){
			matching = el;
		};
	})
	return matching
}
module.exports.getBooksByClass = function(klasa){
	return this.Ksiazki[klasa]
}
module.exports.getBooksBySubject = function(klasa,subj){
	return this.Ksiazki_Subjects[klasa][subj]
}
module.exports.getALLBooks = function(){
	return this.Ksiazki;
}
module.exports.getPagesOfBook= function(book){
	return book.pages
}
module.exports.getExList= function(book,page){
	let resp = JSON.parse(this.REQ_GET(`https://odrabiamy.pl/api/v1.3/ksiazki/${book.id}/zadania/strona/${page}/`))
	return resp;
}
module.exports.GetExercise= function(ex,index){ //ex from getExList();
	ex = ex[index]
	let id = ex.book.id;
	let exid = ex.id;
	let page = ex.page;
	let subj = ex.book.subject;
	let url = `https://odrabiamy.pl/${subj}/ksiazka-${id}/strona-${page}/zadanie-${exid}`
	return this.GetEX(url);
}
const puppeter = require('puppeteer');
browser = null;
cookies = '';
module.exports.GetEX = async function odrabiamyGetExercise(href) 
{
	if(browser==null)await launchbrowser(false);
	let page = await browser.newPage();
	await page.setCookie(...cookies)
    await page.goto(href);
    await page.waitFor(500);
        
        try{await page.click('#frontend-root > div > div.rodo-modal-blur > div > div > div.rodo-form > div > div.buttons.rodo-box-item > button')}catch{}
        await page.waitForSelector(".username");
        await page.waitFor(() => !document.querySelector(".freePart"));
        await page.waitFor(500);

		const sol = await page.evaluate(() => {
			let elements = document.getElementsByClassName('exercise-solution')[0].innerHTML;
			return elements;
		});

		let screeshotArgs = {}
		await page.setContent(sol)
		const element = await page.$('body')
		const buffer = await element.screenshot({ path: "./tmp.png", omitBackground: false, ...screeshotArgs })
		await page.close();
		return buffer
}
module.exports.GetCookie = async function(username,password) 
{
	await launchbrowser(true);
	let page = await browser.newPage();
	await page.goto('https://odrabiamy.pl/?signIn=true&type=Login');
	await page.type('.form-control[name=login]',username);
	await page.type('.form-control[name=password]',password);
	await page.waitForSelector(".username");
	await page.waitFor(500);
	cookies = await page.cookies()
	page.close()
	browser.close();
	browser = null;
}

launchbrowser = async function(devtools){

	try{browser = await puppeter.launch({args: ['--no-sandbox'],devtools:devtools})}
    catch(ex){
        try{
			console.log(ex)
        browser = await puppeter.launch({ executablePath: 'chromium-browser' ,devtools:devtools})}catch{
            browser = await puppeter.launch({
                'args': [
                    '--disable-web-security',
                    '--allow-http-screen-capture',
                    '--allow-running-insecure-content',
                    '--disable-features=site-per-process',
                    '--no-sandbox'
                ],
                headless: true,
				executablePath: '/usr/bin/chromium-browser',
				devtools:devtools
            });
        }
    }
}