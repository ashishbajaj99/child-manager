var Thread = require('../index.js');
var params = {num: 500000};
var doneFlag = 16;

var thread = new Thread('./compute.js', function(out) {
	console.log("CPU intensive out = ", out);
	doneFlag--;
	if(doneFlag == 0) {
	    thread.close();
	}
    }, 8);

thread.execute(params);

for(var i=0; i<5; i++) {
    thread.execute({num: 5},i);
}

for(var i=0; i<5; i++) {
    thread.execute({num: 5},1);
}

for(var i=0; i<5; i++) {
    thread.execute({num: 5});
}


console.log("I am done with scheduling");
