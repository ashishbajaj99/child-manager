var Thread = require('../index.js');
var thread = new Thread(3, './compute.js');

var params = {num: 5};

for(var i = 0; i<10; i++)
    thread.execute(params);

console.log("I am done");
