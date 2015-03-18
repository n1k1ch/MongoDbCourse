var http = require('http');

var server = http.createServer(function(req, res) {
	res.writeHead(200);
	res.end('Hie');
});

server.listen(1010);
console.log('Listening on ' + 1010);