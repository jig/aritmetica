var cluster = require('cluster');

if(cluster.isMaster) {
	require('os').cpus().forEach(function () {
										cluster.fork();
									});
} else {
	if(cluster.worker.id<=8) {
		console.log('pid: ' + cluster.worker.id);
		var a = 1;
		while(true) {
			a = (a + 2 / a);
		}
	}
}