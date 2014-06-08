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
    thread.execute(i, i%8); //i%8 specifies affinity, is optional argument
}

console.log("Done with scheduling...");
```
Below is an example `compute.js`
```javascript
function compute(params) {
    console.log("Done computing ", params);
    return params; //JSON to return back to the parent
}

process.on('message', function(params) {
    process.send(compute(params)); 
});
```
Note that the `compute.js` file **must** contain a `process.on` function call to be able to communicate its outputs back to the parent process.

### Constructor: Thread(proc, next, [numThreads])
Returns a thread object. The inputs are:
* `proc` - The .js file that needs to be launched as a seperate child process
* `next` - The callback function to execute in the context of the parent process after the child process has sent back a compute done message.
**Note:** Output parameters can be passed back to the parent process as JSON object via process.send, and will come in as arguments to this callback
* `numThreads` - Optional argument to suggest number of child processes to fork. If left blank, then the number of child processes will default to number of available CPU cores available on your machine

### Thread.execute(params, [affinity])
Kick starts child process in a round robin manner. If child is busy, the start command is queued to the child process. The inputs are:
* `params` - Input to the child process to start its computations. Can be JSON.
* `affinity` - Optional argument to specifiy which thread to execute this on. If left blank then it will be queued to the next child process in a circular fashion

### Thread.close()
Kills all child processes - to be used by parent to clean up all the child processes

License
==========
The MIT License (MIT)

Copyright (c) 2014 Ashish Bajaj bajaj.ashish@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
