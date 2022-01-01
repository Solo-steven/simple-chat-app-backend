const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const config = require('./config.json');
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    origin: config.test
}))
app.use(cookieParser());

const authRouter = require('./router/auth');
app.use('/auth', authRouter);

const userRouter = require('./router/user');
app.use("/user", userRouter);

app.listen(config.server.port, async () => {
    const { host, port, name } = config.db;
    await mongoose.connect(`mongodb://${host}:${port}/${name}`);
    console.log("Server run", config.server.port);
});