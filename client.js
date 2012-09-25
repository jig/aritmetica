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
	.option('-o, --operation [op_name]', 'addition')
	.parse(process.argv);

var data = JSON.stringify([
						parseInt(args.arg1, 10), 
						parseInt(args.arg2, 10)
					]);

var request = http.request({
						host: 'localhost',
						port: 80,
						method: 'POST',
						path: '/' + args.operation,
						headers: {
							'Content-Length': data.length,
							'Content-Type': 'application/json'
						}
					}, 
					function(response){
						var resData = '';

						response.on('data', function (chunk) {
							resData += chunk;
						});
						response.on('end', function () {
							var res = JSON.parse(resData);
							if(res.statusOk) {
								console.log("Result: " + res.result);
							} else {
								console.log("Error: raw response '" + resData + "'");
							}
						});
					});

// Tractament d'errors.
request.on('error', function (error) {
	console.log("ERROR: " + error.message);
});

request.write(data);
request.end();
