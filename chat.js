var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userCount = 0;

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
}); 

app.get('/jam-sesh', function(req, res) {
	res.sendFile(__dirname + '/jam-sesh.html')
});

app.get('/text-adventure', function(req, res) {
	res.sendFile(__dirname + '/text-adventure.html')
});

app.get('/demos', function(req, res) {
	res.sendFile(__dirname + '/demos.html')
});

app.get('/resume', function(req, res) {
	res.sendFile(__dirname + '/resume-nathaniel-le.pdf')
});

io.on('connection', function(socket) { 
	userCount++;

    socket.on('note on', function (freq) {
        io.sockets.emit('note on', freq); 
    });

    socket.on('note off', function(freq) {
        io.sockets.emit('note off', freq);
    });
	
	socket.on('disconnect', function(){
		console.log('someone disconnected');
		userCount--; 		
	});
});


http.listen(8080, function() { 
    console.log('listening on *:8080');
});
