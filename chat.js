var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userCount = 0;

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
}); 

io.on('connection', function(socket) { 
	userCount++;

    socket.on('note on', function (freq) {
        socket.broadcast.emit('note on', freq); 
    });

    socket.on('note off', function(freq) {
        socket.broadcast.emit('note off', freq);
    });

    socket.on('message', function(msg) {
        socket.broadcast.emit('message', msg); 
    });
	
	socket.on('disconnect', function(){
		console.log('someone disconnected');
		userCount--; 		
	});
});


http.listen(8080, function() { 
    console.log('listening on *:8080');
});
