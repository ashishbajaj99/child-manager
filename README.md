child-manager
=============

An extremely clean package to aid in running CPU intensive operations outside of the event loop, i.e. via using child processes. 

child-manager module will launch child processes on user specified .js file. The number of threads to spawn is left to the programmers choice, and if not set it will default to the number of CPU cores available on the machine that it is executing on.

Installation
============
```
$ npm install child-manager
 