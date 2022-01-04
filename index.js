const http = require('http');
const express = require('express');
const {Server} = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerDoc = require('swagger-jsdoc');
const swaggerServer = require('swagger-ui-express');
const app = express();
const config = require('./config.json');

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
  origin: config.test,
  credentials: true,
}));
app.use(cookieParser());
const openapiDoc = swaggerDoc(config.opneapi);
app.use('/doc', swaggerServer.serve, swaggerServer.setup(openapiDoc));

const authRouter = require('./router/auth');
app.use('/auth', authRouter);

const userRouter = require('./router/user');
app.use('/user', userRouter);

const messageRouter = require('./router/message');
app.use('/message', messageRouter);

/**
 *  Socket set up
 */
const messageModel = require('./model/message');
const sockets = {};
const server = http.createServer(app);
const io = new Server(server);
io.on('connect', (socket) => {
  socket.on('init', async (email) => {
    console.log('[New Socket]:', email);
    sockets[email] = socket;
  });
  socket.on('message/input', async (data) => {
    const {sender, reciver, message} = data;
    if (!sender || !reciver|| !message) return;
    console.log('[Socket Messgae Input]', sender, reciver, message);
    sockets[sender] = socket;
    const newData = new messageModel({
      sender, content: message, reciver, timestamp: (new Date()).toISOString(),
    });
    newData.save();
    if (!sockets[reciver]) {
      return;
    }
    sockets[reciver].emit('message/output', {message, sender});
  });
});
server.listen(config.server.port, async () => {
  const {host, port, name} = config.db;
  await mongoose.connect(`mongodb://${host}:${port}/${name}`);
  console.log('Server run', config.server.port);
});
