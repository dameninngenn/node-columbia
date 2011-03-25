var sys = require("sys"),
    ws  = require('websocket-server'),
    path = require('path');

/**
 * web-server
 */
var express = require('express');
var app = express.createServer();

app.use(express.static(path.join(__dirname,'static')));
app.set('view engine','ejs');
app.get('/:id', function(req, res) {
    res.render('index', {
        layout: false,
        locals: {id: req.params.id}
    });
});


/**
 * websocket-server
 */
var server = ws.createServer({server: app});
var points = [];

server.addListener("listening", function(){
  sys.log("Listening for connections.");
});

server.addListener("connection", function(conn){

  sys.log('Hello');

  // send all points
  if (points.length > 0) {
    for(var i in points) {
      conn.send(points[i]);
    } 
  }

  conn.addListener("message", function(message){
      if (message.indexOf('@CLEAR') > -1) {
        points = [];
        server.broadcast(message);
      } else {
        points.push(message);
        server.broadcast(message);
      }
  });

});

server.addListener("close", function(conn){
  sys.log('Close...');
});

server.listen(443);
