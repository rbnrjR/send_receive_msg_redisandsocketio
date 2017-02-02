const express = require('express'),
      app = express(),
      server = require('http').Server(app),
      io = require('socket.io').listen(server),
      client = require('./redisclient.js'),
      socket = require('./sockets/socket.js');

let obj = {};

//Redis connection ---------->
client.on('connect', function() {
  console.log('Connected');
});

//Socket Server ---------->
server.listen(8000, function () {
  console.log('server started on  8000');
});

//Socket connection ---------->
io.on('connection', socket);
