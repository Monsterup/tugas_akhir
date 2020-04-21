let http = require("http");
let routes = require("routes")();
let url = require("url");
const {spawn} = require('child_process');

function runCli(command= [], callback){
    const bat = spawn('powershell.exe', command);
    bat.stdout.on('data', (data) => {
        callback(data.toString());
    });
}
routes.addRoute('/:args?', function (req,res) {
    res.writeHead(200,{'Content-Type': 'text/plain'})
    res.writeHead(200,{'Access-Control-Allow-Origin': 'http://localhost:3000'})
    if (this.params.args){
        let cmd = this.params.args;
        let cmd_ = cmd.split(" ");
        runCli(cmd_,function (e) {
            res.end(JSON.stringify({status : "success", message : e}));
        })
    }else{
        res.end(JSON.stringify({status : "success", message : "Welcome to Avesbox API"}));
    }
});

http.createServer(function (req, res) {
    let path = url.parse(req.url).pathname;
    let match = routes.match(path);
    if (match){
        match.fn(req,res);
    }else{
        res.writeHead(404,{'Content-Type': 'text/plain'})
        res.end(JSON.stringify({status : "error", message : 'Not Found'}));
    }
}).listen(8081);
