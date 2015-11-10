var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404(response){
	response.writeHead(404,{'Content-Type':'text/plain'});
	response.write('error 404,not found rescource');
	response.end();

}

function sendFile(response,filepath,fileContent){
	response.writeHead(200,{'Content-Type':mime.lookup(path.basename(filepath))});
	response.end(fileContent);
}
function serveStatic (response,cache,absPath){
	if (cache[absPath]) {
		sendFile(response,absPath,cache[absPath]);
	}else{
		fs.exists(absPath,function(exists){
			if (exists) {
				fs.readFile(absPath,function(err,data){
					if (err) {
						send404(response);
					}else{
						cache[absPath] = data;
						sendFile(response,absPath,data);
					}

				});
			}else{
				send404(response);

			}

		});
	}
}

var server = http.createServer(function(request,response){
	var filepath = false;
	if (request.url == '/') {
		filepath = 'public/index.html';
	}else{
		filepath = 'public' + request.url;
	}
	var absPath = './' + filepath;
	serveStatic(response,cache,absPath);
});

server.listen(3000,function(){
	console.log('server start listen on port 3000.');
});
var chatserver = require('./lib/chat_server');
chatserver.listen(server);