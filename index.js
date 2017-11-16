var express = require("express");
var app = express();

app.get("/", function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var port = 8080;
app.listen(port, function() {
	console.log("Listening on port: " + port); 
})
