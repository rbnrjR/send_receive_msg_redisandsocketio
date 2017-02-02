const client = require('./../redisclient.js');

//set the unreadNotifications count in the redis hashes
module.exports = function setUnreadCount(sender, channelID) {
  client.hincrby(sender+"/unreadNotifications", "itzFriday#"+channelID, 1);
}
