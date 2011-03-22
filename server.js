var sys = require("sys"),
    ws  = require('websocket-server');

/**
 * web-server
 */
var express = require('express');
var app = express.createServer();
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

/**
 * websocket-server
 */
//var json = JSON.stringify;
var server = ws.createServer({server: app});
var points = [];

server.addListener("listening", function(){
  sys.log("Listening for connections.");
});

server.addListener("connection", function(conn){

  sys.log('Hello');
  //server.broadcast("@HELLO");

  // send all points
  if (points.length > 0) {
    for(var i in points) {
      conn.send(points[i]);
    } 
  }

  conn.addListener("message", function(message){
      if (message.indexOf('@') > -1) {
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
