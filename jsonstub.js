// Copyright Jordi Íñigo Griera, 2012
// LGPL

var extensions = require('./extensions');

var serializedRequest = function (args) {
	return JSON.parse(args);
}

var serializedOkResponse = function (response, result) {
	var resultPacket = {
		statusOk: true,
		result: result
	};

	response.writeHead(200, {"Content-Type": extensions.json});
	response.write(JSON.stringify(resultPacket));
	response.end();	
}

var serializedRuntimeErrorResponse = function (exception) {
	var resultPacket = {
		statusOk: false,
		result: exception
	};

	response.writeHead(500, {"Content-Type": extensions.json});
	response.write(JSON.stringify(resultPacket));
	response.end();	
}

exports.serializedRequest = serializedRequest;
exports.serializedOkResponse = serializedOkResponse;
exports.serializedRuntimeErrorResponse = serializedRuntimeErrorResponse;
