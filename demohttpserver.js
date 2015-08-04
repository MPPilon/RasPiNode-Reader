var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.sendfile('index.html');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.lod("Listening on " + port);
});
