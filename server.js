//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];
var nbPlayers=0;
var socketScreen;

io.on('connection', function (socket) {
    // messages.forEach(function (data) {
    //   socket.emit('message', data);
    // });
    
    if(nbPlayers<4){
      
      sockets.push(socket);
      
      //socket.emit("newPlayer",players);
      io.sockets.emit("newPlayer",players);
      
      socket.on('disconnect', function () {
        removePlayer(socket.id);
        sockets.splice(sockets.indexOf(socket), 1);
      });
      
      socket.on('screen', function (name) 
      {
        socketScreen=socket;
         
      });
      
      socket.on('givepseudo', function (name) 
      {
        var player = new Player(name, socket.id);
        players.push(player);
        nbPlayers++;
         
          io.sockets.emit("newPlayer",players);
          
          if(nbPlayers==2)
          {
            io.sockets.emit("startGame","The game will begin");
            socketScreen.emit("start",players);
          }
         
      });
    
    }
    

  });



function removePlayer(idSocket){
  var indice=-1;
  for (var i =0; i< players.length; i++ ) 
  {
    if(players[i].id==idSocket){
      indice=i;
      break;
    }
  }
  if(indice!=-1){
    players.splice(indice,1);
  }
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

var players=[];

function Player(name,idsocket){
  this.name=name;
  this.id=idsocket;
  this.time=0;
}