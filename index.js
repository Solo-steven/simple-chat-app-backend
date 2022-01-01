const express = require('express');
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

app.listen(config.server.port, async () => {
  const {host, port, name} = config.db;
  await mongoose.connect(`mongodb://${host}:${port}/${name}`);
  console.log('Server run', config.server.port);
});
