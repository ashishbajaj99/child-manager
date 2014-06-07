child-manager
=============

An extremely clean package to aid in running CPU intensive operations outside of the event loop, i.e. via using child processes. 

child-manager module will launch child processes on user specified .js file. The number of threads to spawn is left to the programmers choice, and if not set it will default to the number of CPU cores available on the machine that it is executing on.

Installation
============
```
$ npm install child-manager
```

API
============
Below `index.js` makes use of `child-manager` module to launch the `compute.js` file. The `child-manager` module exports a constuctor as shown below:
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

