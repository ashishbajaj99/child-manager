child-manager
=============

An extremely clean package to aid in running CPU intensive operations outside of the event loop, i.e. via using child processes. 

child-manager module will launch child processes on a user specified .js file. The number of threads to spawn is a programmers choice, and if not set it will default to the number of CPU cores available on the machine that it is executing on.

Installation
============
```
$ npm install child-manager
```

API
============
Below `index.js` makes use of `child-manager` module to launch the `compute.js` file on 8 child processes. The `child-manager` module exports a constuctor as shown below:
```javascript
var doneWithCompute = 0;
var Thread = require('child-manager');

// Launch compute.js on 8 child processes
var thread = new Thread('./compute.js', function (out) {
        console.log("Got output", out);
        doneWithCompute++;
        if(doneWithCompute == 16) {
            thread.close(); //kill child proc and exit program                       
        }
    }, 8);

//Execute twice on each of the 8 child processes
for(i=0; i<16; i++) {
    thread.execute(i, -1);
}

console.log("Done with scheduling...");
```
Below is an example `compute.js`
```javascript
function compute(params) {
    console.log("Done computing ", params);
    return params;
}

process.on('message', function(params) {
		      process.send(compute(params));
    });
```
Note that the `compute.js` file **must** contain a `process.on` function call to be able to communicate its outputs back to the parent process.

### Thread(proc, next, [numThreads])
Returns a thread object. The inputs are:
* `proc` - The .js file that needs to be launched as a seperate child process
* `next` - The callback function to execute in the context of the parent process after the child process has sent back a compute done message
* `numThreads` - Optional parameter to suggest number of child processes to fork. If left blank, then the number of child processes will default to number of available CPU cores available on your machine


