const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
  content: String,
  sender: String,
  user1: String,
  user2: String,
  timestamp: Date,
});

module.exports = model('messages', messageSchema);
