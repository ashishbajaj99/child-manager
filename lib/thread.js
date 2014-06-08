function Thread(proc, next, numThreads) {
    var err = new Error("Invalid number of threads requested");
    if(numThreads < 1) throw err;

    this.numCPUs = require('os').cpus().length;
    if(numThreads != null) {
	if(numThreads > this.numCPUs) {
	    console.log("Warning: Allocating more threads than available CPUs(" 
			+ this.numCPUs + ")");
	}
	this.numCPUs = numThreads;
    }
    this.name = proc;
    this.threadArray = new Array();
    this.cp = require('child_process');
    this.nextAvailThread = 0;
    
    for(var i=0; i<this.numCPUs; i++) {
        this.threadArray.push(this.cp.fork(proc));
	this.threadArray[i].on('message', function(out) {
	    next(out);
	});
    }
}

Thread.prototype.execute = function(params, affinity) {
    var nextAvailThread = this.nextAvailThread;
    var updateNextAvailThreadFlag = true;

    if(affinity != null) {
	var err = new Error("Invalid thread affinity");
	if( (affinity > (this.numCPUs-1)) || 
	    (affinity < 0) ) throw err;
	if(affinity > -1) {
	    nextAvailThread = affinity;
	    updateNextAvailThreadFlag = false;
	}
    }

    console.log("Executing on thread: " + nextAvailThread +
		" with process id: ", this.threadArray[nextAvailThread].pid);
       
    this.threadArray[nextAvailThread].send(params);

    if(updateNextAvailThreadFlag) {
	this.nextAvailThread++;
	if(this.nextAvailThread == this.numCPUs)
	    this.nextAvailThread = 0;
    }
}

Thread.prototype.close = function() {
    for(var i in this.threadArray) {
        this.threadArray[i].kill();
    }
};
    
exports = module.exports = Thread;
