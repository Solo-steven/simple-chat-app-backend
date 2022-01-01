const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
  content: String,
  sender: String,
  reciver: String,
  timestamp: Date,
});

module.exports = model('messages', messageSchema);
