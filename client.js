// Copyright Jordi Íñigo Griera, 2012
// LGPL

var http = require("http");
var args = require('commander');

args
	.version('0.1')
	.option('-p, --port [number]', 'server port', 80)
	.option('-s, --server [number]', 'server address', 'localhost')
	.option('-1, --arg1 [number]', 'first argument', 0)
	.option('-2, --arg2 [number]', 'second argument', 0)
	.option('-r, --rawreq [data]', 'request in JSON sintax', '{}')
	.option('-o, --operation [op_name]', 'operation identifier', 'addition')
	.option('-n, --number [n]', 'number of concurrent iterations', 1)
	.option('-c, --concurrent [n]', 'maximum concurrency', 1)
	.parse(process.argv);

http.globalAgent.maxSockets = parseInt(args.concurrent, 10);

if(args.rawreq) {
	var data = args.rawreq;
} else {	
	var data = JSON.stringify([
						parseInt(args.arg1, 10), 
						parseInt(args.arg2, 10)
					]);
}

var options = {
			host: args.server,
			port: 80,
			method: 'POST',
			path: '/' + args.operation,
			headers: {
				'Host': args.server,
				'Content-Length': data.length,
				'Content-Type': 'application/json'
			}
		}

var socketName = args.server + ':' + args.port;
		
if(args.proxy) {
	var regex = '([^:]+):([0-9]+)';
	options.host = args.proxy.match(regex)[1];
	options.port = args.proxy.match(regex)[2];
	options.path = 'http://' + args.proxy + '/' + args.operation;
}

var chainRequest = function (options, n) {
	var request = http.request(
						options, 
						function(response){
							var resData = '';
							response.on('data', function (chunk) {
								resData += chunk;
							});
							response.on('end', function () {});

							if(n>0) {
								chainRequest(options, n-1);
							}
						});

	request.on('error', function (error) {
		console.log("ERROR: " + error.message);
	});

	request.write(data);
	request.end();
}

for(var i=0; i<args.concurrent; ++i) {
	chainRequest(options, args.number);
}
