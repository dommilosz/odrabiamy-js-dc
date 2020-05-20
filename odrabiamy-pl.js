var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
module.exports.JSON_RESP = {};

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
    this.JSON_RESP = this.REQ_GET('https://odrabiamy.pl/api/v1.3/ksiazki');
}

this.GetData();