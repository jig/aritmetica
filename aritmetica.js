// Copyright Jordi Íñigo Griera, 2012
// LGPL

var args = require('commander');
var fs = require('fs');
var cluster = require('cluster');

var server = require('./server');
var jsonstub = require('./jsonstub');

args
	.version('0.1')
	.option('-p, --port [number]', 'client port', 80)
	.option('-f, --folder [folderpath]', 'root folder path', './' )
	.option('-c, --cluster', 'cluster of processes')
	.parse(process.argv);

if(cluster.isMaster) {
	console.log('Binding to port ', args.port);
	console.log('Folder path: ', args.folder);
	console.log('Processor: ' + require('os').cpus()[0].model);
	if(args.cluster) {
		console.log('Cluster: ' + args.cluster);
		require('os').cpus().forEach(function (item) {
										cluster.fork();
									});
	} else {
		console.log('Cluster: no cluster');
		cluster.fork();
	}
} else {
	var service = {
		addition:
			function (args, response) {
				var result = 0;
				for(var item = 0; item < args.length; ++item) {
					result += args[item];
				}
				response(result);
			},
		substraction: 
			function (args, response) {
				response(args[0]-args[1]);
			},
		multiplication: 
			function (args, response) {
				var result = 1;
				for(var item = 0; item < args.length; ++item) {
					result *= args[item];
				}
				response(result);
			},
		division: 
			function (args, response) {
				response(args[0]/args[1]);
			},
		distance:
			function (args, response) {
				var result = 0;
				for(var item = 0; item < args.length; ++item) {
					result += args[item]*args[item];
				}
				response( Math.sqrt(result) );
			}
		}
	server.start(args.port, jsonstub, service);
	console.log("Server started: " + cluster.worker.id);	
}
