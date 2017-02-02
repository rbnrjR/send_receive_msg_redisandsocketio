const client = require('./../redisclient.js');

//get the unreadNotifications count from the redis hashes
module.exports = function getUnreadCount(msg) {
  client.hgetall(msg.user+"/unreadNotifications",function(err, reply){
    socket.emit('unreadNotification',reply);
    console.log(reply);
  });
}
