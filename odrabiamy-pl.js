var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
module.exports.JSON_RESP = {};
module.exports.Ksiazki = {};
module.exports.Ksiazki_Subjects = {};
const fs = require('fs');

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
module.exports.GetData = function () {
    this.JSON_RESP = JSON.parse(
        this.REQ_GET("https://odrabiamy.pl/api/v1.3/ksiazki")
    );
    this.JSON_RESP.forEach((el) => {
        var donegrades = [];
        var grades = el.grades;
        var subj = el.subject;

        grades.forEach((el2) => {
            if (!this.Ksiazki[el2]) {
                this.Ksiazki[el2] = [];
            }
            if (!donegrades.includes(el2)) {
                this.Ksiazki[el2].push(el);
                donegrades.push(el2);
                if (!this.Ksiazki_Subjects[el2])
                    this.Ksiazki_Subjects[el2] = {};
                if (!this.Ksiazki_Subjects[el2][subj]) {
                    this.Ksiazki_Subjects[el2][subj] = [];
                }
                this.Ksiazki_Subjects[el2][subj].push(el);
            }
        });
    });
};

this.GetData();
module.exports.getBookByID = function (klasa, id) {
    var matching = "";
    this.Ksiazki[klasa].forEach((el) => {
        if (el.id == parseInt(id)) {
            matching = el;
        }
    });
    return matching;
};
module.exports.getBooksByClass = function (klasa) {
    return this.Ksiazki[klasa];
};
module.exports.getBooksBySubject = function (klasa, subj) {
    return this.Ksiazki_Subjects[klasa][subj];
};
module.exports.getALLBooks = function () {
    return this.Ksiazki;
};
module.exports.getPagesOfBook = function (book) {
    return book.pages;
};
module.exports.getExList = function (book, page) {
    let requid = StartRequestTimer();
    let resp = JSON.parse(
        this.REQ_GET(
            `https://odrabiamy.pl/api/v1.3/ksiazki/${book.id}/zadania/strona/${page}/`
        )
    );
    this.RequestTook = EndRequestTimer(requid);
    return resp;
};
module.exports.GetExercise = function (ex, index) {
    //ex from getExList();
    ex = ex[index];
    let id = ex.book.id;
    let exid = ex.id;
    let page = ex.page;
    let subj = ex.book.subject;
    let url = `https://odrabiamy.pl/${subj}/ksiazka-${id}/strona-${page}/zadanie-${exid}`;
    return this.GetEX(url);
};
const puppeter = require("puppeteer");
browser = null;
cookies = "";
buffor = {}
module.exports.GetEX = async function odrabiamyGetExercise(href) {
    if(buffor[href])return buffor[href];
    let requid = StartRequestTimer();
    if (browser == null) await launchbrowser(true).catch(ex => {
        throw ex
    });
    let page = await browser.newPage().catch(ex => {
        throw ex
    });
    await page.setCookie(...cookies).catch(ex => {
        throw ex
    });
    await page.goto(href, {waitUntil: 'load', timeout: 300000}).catch(ex => {
        page.close();
        throw ex
    });
    await page.waitFor(500);

    try {
        await page.click(
            ".rodo-grid > div.buttons > button.btn"
        ).catch(_ => {
        });
    } catch {
    }
    await page.waitForSelector("#header-avatar", {timeout: 300000}).catch(ex => {
        throw ex
    });

    await page.waitFor(() => !document.querySelector(".freePart")).catch(ex => {
        throw ex
    });
    await page.waitFor(500);
    await page.waitForSelector('.exercise-solution', {timeout: 300000}).catch(ex => {
        throw ex
    });

    const sol = await page.evaluate(() => {
        let elements = document.getElementsByClassName("exercise-solution")[0]
            .innerHTML;
        return elements;
    });

    let screeshotArgs = {};
    await page.setContent(sol).catch(ex => {
        throw ex
    });
    const element = await page.$("body").catch(ex => {
        throw ex
    });
    const buffer = await element.screenshot({
        path: "./tmp.png",
        omitBackground: false,
        ...screeshotArgs
    }).catch(ex => {
        throw ex
    });
    await page.close().catch(ex => {
        throw ex
    });
    this.RequestTook = EndRequestTimer(requid);
    buffor[href] = buffer;
    return buffer;
};
module.exports.RequestTook = 0;

module.exports.GetCookie = async function (username, password) {
    await launchbrowser(true);
    let page = await browser.newPage();
    let logged = false;
    try {
        let ckie = JSON.parse(fs.readFileSync('./cookies.json'))
        await page.setCookie(...ckie)
        logged = true;
    } catch {

    }
    await page.goto("https://odrabiamy.pl/?signIn=true&type=Login", {waitUntil: 'load', timeout: 300000});
    await page.waitForSelector("#header-avatar", {timeout: 500}).catch(_ => {
        logged = false;
    })
    if (!logged) {
        try {
            await page.type(".form-control[name=login]", username);
            await page.type(".form-control[name=password]", password);
        } catch {
        }
    }
    await page.waitForSelector("#header-avatar", {timeout: 300000});
    await page.waitFor(500);
    cookies = await page.cookies();
    fs.writeFileSync('./cookies.json', JSON.stringify(cookies));
    await page.close();
    await browser.close();
    browser = null;
};

launchbrowser = async function (visible) {
    headless = !visible
    try {
        browser = await puppeter.launch({
            args: ["--no-sandbox"],
            headless: headless
        });
    } catch (ex) {
        try {
            console.log(ex);
            browser = await puppeter.launch({
                executablePath: "chromium-browser",
                headless: headless
            });
        } catch {
            browser = await puppeter.launch({
                args: [
                    "--disable-web-security",
                    "--allow-http-screen-capture",
                    "--allow-running-insecure-content",
                    "--disable-features=site-per-process",
                    "--no-sandbox"
                ],
                headless: headless,
                executablePath: "/usr/bin/chromium-browser",
                devtools: devtools
            });
        }
    }
};

requests = {}
StartRequestTimer = function () {
    let start = Math.floor(new Date());
    let id = Math.floor(Math.random() * 1000);
    requests[id] = start;
    return id;
}
EndRequestTimer = function (id) {
    let end = Math.floor(new Date());
    let timer = end - requests[id]
    return timer;
}
