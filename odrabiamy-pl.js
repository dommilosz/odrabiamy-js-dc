var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
module.exports.JSON_RESP = {};
module.exports.Ksiazki = {};


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
		var grades = el.grades_number.split(',');
		grades.forEach(el2=>{
			if(!this.Ksiazki[el2]){
				this.Ksiazki[el2] = [];
			}
			if(!donegrades.includes(el2))
			{
			this.Ksiazki[el2].push(el);
			donegrades.push(el2);
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