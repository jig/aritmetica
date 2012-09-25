// Copyright Jordi Íñigo Griera, 2012
// LGPL

var args = require('commander');
var fs = require('fs');
var server = require('./server');
var jsonstub = require('./jsonstub');

args
	.version('0.1')
	.option('-p, --port [number]', 'client port', 80)
	.option('-f, --folder [folderpath]', 'root folder path', './' )
	.parse(process.argv);

console.log('Binding to port ', args.port);
console.log('Folder path: ', args.folder);

var service = {
	addition:
		function(args, response) {
			var result = 0;
			for(var item = 0; item < args.length; ++item) {
				result += args[item];
			}
			response(result);
		},
	substraction: 
		function(args, response) {
			response(args[0]-args[1]);
		},
	multiplication: 
		function(args, response) {
			var result = 1;
			for(var item = 0; item < args.length; ++item) {
				result *= args[item];
			}
			response(result);
		},
	division: 
		function(args, response) {
			response(args[0]/args[1]);
		},
}

server.start(args.port, jsonstub, service);
