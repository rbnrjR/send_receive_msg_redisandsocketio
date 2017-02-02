const client = require('./../redisclient.js')

//push messages into redis list
module.exports = function redisPush(channelID, obj) {
  client.lpush("#"+channelID, JSON.stringify(obj), function(err, reply){
    console.log(reply+' messages in the list');
    if(reply%50==0) {
      console.log('Message reached 50 in the list - ready to push into DB');
    }
    else {
      console.log((50-reply%50) + ' messages left to push');
    }
  });
}
