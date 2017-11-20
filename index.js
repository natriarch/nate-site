var express = require("express");
var app = express();
var path = require('path');
var io = require('io');
var jquery = require('jquery');
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var port = 8080;
app.listen(port, function() {
	console.log("Listening on port: " + port); 
})
