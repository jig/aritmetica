// Copyright Jordi Íñigo Griera, 2012
// LGPL

var http = require("http");
var args = require('commander');

args
	.version('0.1')
	.option('-p, --port [number]', 'server port', 80)
	.option('-s, --server [number]', 'server address', 'localhost')
	.option('-1, --arg1 [number]', 0)
	.option('-2, --arg2 [number]', 0)
	.option('-r, --rawreq [data]', '{}')
	.option('-o, --operation [op_name]', 'addition')
	.parse(process.argv);

if(args.rawreq) {
	var data = args.rawreq;
} else {	
	var data = JSON.stringify([
						parseInt(args.arg1, 10), 
						parseInt(args.arg2, 10)
					]);
}

var options = {}

if(args.proxy) {
	var regex = '([^:]+):([0-9]+)';
	options = {
		host: args.proxy.match(regex)[1],
		port: args.proxy.match(regex)[2],
		method: 'POST',
		path: 'http://' + args.proxy + '/' + args.operation,
		headers: {
			'Host': args.server,
			'Content-Length': data.length,
			'Content-Type': 'application/json'
		}
	}
} else {
	options = {
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
}

var request = http.request(
					options, 
					function(response){
						var resData = '';

						response.on('data', function (chunk) {
							resData += chunk;
						});
						response.on('end', function () {
							console.log("Result: " + resData);
						});
					});

// Tractament d'errors.
request.on('error', function (error) {
	console.log("ERROR: " + error.message);
});

request.write(data);
request.end();
