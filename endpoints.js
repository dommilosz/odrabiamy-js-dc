webserver = require('./Server/webserver.js')
server = webserver.server
auth = require('./Server/auth-handler');
odrabiamyjs = require('./odrabiamy-pl');
const fs = require("fs");

server.get('/',function(req, res) {
    params = webserver.GetParams(req)
    if(params.hash&&params.username&&params.username.trim()!=""&&auth.CheckHash( params.hash,params.username)){
        res.writeHead(200)
        res.write(fs.readFileSync('./Server/index.html'))
        res.end()
    }else{
        res.writeHead(200)
        res.write(fs.readFileSync('./Server/login.html'))
        res.end()
    }
})
server.get('/data',function(req, res) {
    params = webserver.GetParams(req)
    if(params.hash&&params.username&&params.username.trim()!=""&&auth.CheckHash( params.hash,params.username)){
        res.writeHead(200,{"Content-Type": "text/json; charset=utf-8"})
        res.write(JSON.stringify(odrabiamyjs.JSON_RESP))
        res.end()
    }else{
        res.writeHead(200)
        res.write(fs.readFileSync('./Server/login.html'))
        res.end()
    }
})
server.get('/ksiazki',function(req, res) {
    params = webserver.GetParams(req)
    if(params.hash&&params.username&&params.username.trim()!=""&&auth.CheckHash( params.hash,params.username)){
        res.writeHead(200,{"Content-Type": "text/json; charset=utf-8"})
        if(params.klasa&&params.book&&params.subj){
            res.write(JSON.stringify(odrabiamyjs.getBooksBySubject(params.klasa,params.subj)))
        }else
        if(params.klasa&&params.book){
            res.write(JSON.stringify(odrabiamyjs.getBookByID(params.klasa,params.book)))
        }else
        if(params.klasa){
            res.write(JSON.stringify(odrabiamyjs.getBooksByClass(params.klasa)))
        }else{
            res.write(JSON.stringify(odrabiamyjs.Ksiazki))
        }
        
        res.end()
    }else{
        res.writeHead(200)
        res.write(fs.readFileSync('./Server/login.html'))
        res.end()
    }
})
server.get('/pages',function(req, res) {
    params = webserver.GetParams(req)
    if(params.hash&&params.username&&params.username.trim()!=""&&auth.CheckHash( params.hash,params.username)){
        res.writeHead(200,{"Content-Type": "text/json; charset=utf-8"})
        if(params.klasa&&params.book&&params.subj){
            res.write(JSON.stringify(odrabiamyjs.getPagesOfBook( odrabiamyjs.getBookById(params.klasa,params.book))))
        }
        
        res.end()
    }else{
        res.writeHead(200)
        res.write(fs.readFileSync('./Server/login.html'))
        res.end()
    }
})


server.get('/rdata',function(req, res) {
    params = webserver.GetParams(req)
    if(params.hash&&params.username&&params.username.trim()!=""&&auth.CheckHash( params.hash,params.username)){
        res.writeHead(200,{"Content-Type": "text/json; charset=utf-8"})
        odrabiamyjs.GetData();
        res.write(JSON.stringify(odrabiamyjs.JSON_RESP))
        res.end()
    }else{
        res.writeHead(200)
        res.write(fs.readFileSync('./Server/login.html'))
        res.end()
    }
})

server.get('/index.css',function(req, res) {
    params = webserver.GetParams(req)
    res.writeHead(200)
    res.write(fs.readFileSync('./Server/index.css'))
    res.end()
})


