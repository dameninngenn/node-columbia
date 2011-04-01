var sys = require("sys"),
    ws  = require('websocket-server'),
    path = require('path');

/**
 * web-server
 */
var conf = {
    fqdn: 'node-columbia.dameninngenn.com',
    port: 443
};

var express = require('express');
var app = express.createServer();

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname,'static')));
app.set('view engine','ejs');
app.get('/', function(req, res) {
    res.render('index', {
        layout: false,
        locals: {
            fqdn: conf.fqdn,
            error: false
        }
    });
});
app.post('/', function(req, res) {
    if(CheckStr(req.body.user)) {
        res.redirect('/user/' + req.body.user);
    } else {
        res.render('index', {
            layout: false,
            locals: {
                fqdn: conf.fqdn,
                error: true
            }
        });
    }
});
app.get('/user/:id', function(req, res) {
    res.render('user', {
        layout: false,
        locals: {
            id: req.params.id,
            fqdn: conf.fqdn,
            port: conf.port
        }
    });
});
app.get('/admin', function(req, res) {
    res.render('admin', {
        layout: false,
        locals: {
            fqdn: conf.fqdn,
            port: conf.port
        }
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
      } else if(message.indexOf('@DRAW') > -1) {
        points.push(message);
      }
      server.broadcast(message);
  });

});

server.addListener("close", function(conn){
  sys.log('Close...');
});

server.listen(conf.port);


function CheckStr(TargetStr) {
    var str = TargetStr;
    if(str.match(/[^a-zA-Z0-9]+/)) {
        return false;
    }
    return true;
}
