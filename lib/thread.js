var numCPUs = require('os').cpus().length;

function Thread(numThreads, proc, next) {
    if(numThreads > numCPUs) {
	console.log("Warning: Allocating more threads than available CPUs");
    }
    numCPUs = numThreads;
    this.name = proc;
    this.threadArray = new Array();
    this.cp = require('child_process');
    this.nextAvailThread = 0;
    
    for(var i=0; i<numCPUs; i++) {
        this.threadArray.push(this.cp.fork(proc));
	this.threadArray[i].on('message', function(out) {
	    next(out);
	});
    }
}

Thread.prototype.execute = function(params, affinity) {
    var nextAvailThread = this.nextAvailThread;

    if(affinity > -1)
	nextAvailThread = affinity;

    console.log("Executing on thread: " + nextAvailThread +
		" with process id: ", this.threadArray[nextAvailThread].pid);
       
    this.threadArray[nextAvailThread].send(params);

    if(affinity < 0) {
	this.nextAvailThread++;
	if(this.nextAvailThread == numCPUs)
	    this.nextAvailThread = 0;
    }
}

Thread.prototype.close = function() {
    for(var i in this.threadArray) {
        this.threadArray[i].kill();
    }
};
    
exports = module.exports = Thread;