var Thread = require('../index.js');
var params = {num: 500000};
var doneFlag = 15;

var thread = new Thread('./compute.js', function(out) {
	console.log("CPU intensive out = ", out);
	doneFlag--;
	if(doneFlag == 0) {
	    thread.close();
	}
    }, 2);

thread.execute(params,-1);

for(var i=0; i<5; i++) {
    thread.execute({num: 5},1);
}

for(var i=0; i<5; i++) {
    thread.execute({num: 5},2);
}

for(var i=0; i<5; i++) {
    thread.execute({num: 5},0);
}


console.log("I am done with scheduling");
