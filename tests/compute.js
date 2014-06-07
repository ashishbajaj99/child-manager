function counter(num) {
    var a=0, i=0;
    for(; i<num; i++) {
	a+=i;
    }
    return a;
}

function fibo(num) {
    var out = [0, 1];
    
    for(i=2; i<num; i++) {
	out.push(out[i-2]+out[i-1]);
    }
    return out;
}

function computeAll(num) {
    return ({'counter': counter(num), 'fibo': fibo(num)});    
}

process.on('message', function(params) {
	// Call the entry function of your CPU intensive operation
	// @output: JSON that needs to be sent back to caller
	var output = computeAll(params.num);

	//Send back the output to parent
	process.send(output);
    });
