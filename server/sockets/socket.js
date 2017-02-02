module.exports = function(socket) {
  let pub = require('./../redisclient.js').duplicate(),
      sub = require('./../redisclient.js').duplicate(),
      redispush = require('./redispush.js'),
      setunreadcount = require('./setunreadcount.js');
      getunreadcount = require('./getunreadcount.js');

  socket.on('send message', function(sender, channelID, msg, timestamp) {
    obj = {'sender' : sender, 'msg':msg, 'ts_sentTime':timestamp}
    pub.publish(channelID, JSON.stringify(obj)); //Publishing in redis
    redispush; //Push into redis list`
    setunreadcount; //set unreadNotifications count in the redis hashes
  });

  socket.on('getUnreadNotification',function(msg){
    console.log('inside unreadNotifications', msg.user);
    getunreadcount; //get unreadNotifications count from redis hashes
  });

  socket.on("subscribe",function(channel){
    console.log(" inside subscribe");
      sub.subscribe(channel);
  });

  socket.on('disconnect', function(socket){
    sub.unsubscribe();
    console.log('user disconnected');
  });

  sub.on('message', function (channelID, msg) {
    socket.emit('receive message', msg);
  });
  sub.on('subscribe', function(channelID, msg){
    console.log('subscribed');
  });
  sub.on('unsubscribe',function(){
    console.log('unsubscribed')
  });
}
