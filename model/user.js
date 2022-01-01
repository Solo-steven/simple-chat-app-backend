const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: String,
    imgUrl: String,
    email: String,
    passwordHash: String,
    salt: String,
    friends: [String]
});

module.exports = model("users", userSchema);