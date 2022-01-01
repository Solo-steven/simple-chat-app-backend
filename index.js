const express = require('express');
const mongoose = require('mongoose');
const app = express();
const config = require('./config.json');

app.listen(config.server.port, async () => {
    const { host, port, name } = config.db;
    await mongoose.connect(`mongodb://${host}:${port}/${name}`);
    console.log("Server run", config.server.port);
});