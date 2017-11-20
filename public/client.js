var socket = io(),
    audioCtx = new (window.AudioContext||window.webkitAudioContext)(),

    keyboard = new QwertyHancock({
        id: 'keys',
        width: 600,
        height: 150,
        startNote: 'A3',
		octaves: 2
    }),

    vca = audioCtx.createGain(),
    nodes = [];  
    
vca.gain.value = 0.3;
vca.connect(audioCtx.destination);

socket.on('note on', function(freq) {
    var vco = audioCtx.createOscillator();
    vco.frequency.value = freq;
    vco.connect(vca);
    vco.start();
    nodes.push(vco); 
});
    
socket.on('note off', function(freq) {
	console.log('')
    var newNodes = []; 
    for (var i = 0; i < nodes.length; i++) {
        if (Math.round(nodes[i].frequency.value) === Math.round(freq)) {
            nodes[i].stop(0);
            nodes[i].disconnect(); 
		} else {
        newNodes.push(nodes[i]); 
		} 
    
		nodes = newNodes;
    }
});   

socket.on('message', function(msg) {
   console.log(msg);  
});

keyboard.keyDown = function(note, freq) {
	console.log('key down')
    socket.emit('note on', freq);
}

keyboard.keyUp = function(note, freq) {
	console.log('key up')
    socket.emit('note off', freq); 
}
