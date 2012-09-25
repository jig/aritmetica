// Copyright Jordi Íñigo Griera, 2012
// LGPL

var http = require("http");
var url = require("url");

function start(port, stub, service) {
	function onRequest(request, response) {
		var postData = '';

		request.setEncoding('utf8');
	    request.addListener("data", function(postDataChunk) {
			postData += postDataChunk;
	    });

		request.addListener("end", function() {
			var pathname = url.parse(request.url, true).pathname.match( '^/(.*)')[1];

			console.log('pathname = ' + pathname);
			try {
				var args = stub.serializedRequest(postData);
				// service[pathname](args, stub.serializedOkResponse);
				service[pathname](args, function(result) {
					stub.serializedOkResponse(response, result);
				});
			} catch (exception) {
				console.log(exception);
				// stub.serializedRuntimeErrorResponse(exception);
			}
		});
	}

	http.createServer(onRequest).listen(port);
	console.log("Server started.");
}

exports.start = start;
