const express = require('express'),
      app = express(),
      server = require('http').Server(app),
      io = require('socket.io').listen(server),
      redis = require('redis'),
      client = redis.createClient(),
      moment = require('moment');
let obj={},
    date=null;
client.on('connect', function() {
  console.log('Connected');
});
server.listen(8000, function () {
  console.log('server started on  8000');
});
io.on('connection', function (socket) {
  const pub = redis.createClient(),
        sub = redis.createClient();
  console.log('user connected');
  socket.on('send message', function(sender, channelID, msg, timestamp) {
    date=moment(timestamp).format('DD/MM/YYYY/hh:mm:ss');
    obj = {'sender' : sender, 'msg':msg, 'ts_sentTime':timestamp}
    console.log("Message sent", sender, channelID , msg, timestamp);
    pub.publish(channelID, JSON.stringify(obj));
    //sub.subscribe(channelID);
    //console.log('timestamp to date :'+moment(timestamp).format('DD/MM/YYYY/hh:mm:ss'));
    client.lpush("#"+channelID, JSON.stringify(obj), function(err, reply){
      console.log(reply);
      if(reply%50==0) {
        console.log('Message reached 50 in the list - ready to push into DB');
      }
      else {
        console.log((50-reply%50) + ' messages left to push');
      }
    });
    client.hincrby(sender+"/unreadNotifications", "itzFriday#"+channelID, 1);
  });
  socket.on('getUnreadNotification',function(msg){
    console.log('inside unreadNotifications', msg.user);
    client.hgetall(msg.user+"/unreadNotifications",function(err, reply){
      socket.emit('unreadNotification',reply);
      console.log(reply);
    });
  });
  sub.on('message', function (channelID, msg) {
    console.log("emitted from sub.on");
    console.log("Inside the message subscribed",msg.TimeStamp);
    socket.emit('receive message', msg);
  });
  sub.on('subscribe', function(channelID, msg){
    console.log('subscribed');
  });
  sub.on('unsubscribe',function(){console.log('unsubscribed')});

  socket.on("subscribe",function(channel){
    console.log(" inside subscribe");
      sub.subscribe(channel);
    //sh(channel, JSON.stringify(obj));
      //console.log("hhhhhh");
      //socket.emit('receive message', JSON.stringify(obj));
  });

  socket.on('disconnect', function(socket){
    sub.unsubscribe();
    console.log('user disconnected');
  });
});
