import * as express from 'express';
import * as http from 'http';
import Logger from './utils/logger';

const app = express.default();

app.get('/', (_req, res) => {
  res.send({ uptime: process.uptime() });
});

const server = http.createServer(app);
//const io = new socketio.Server(server);

//io.on('connection', (...params) => {
//  console.log(params);
//});

server.listen(process.env.port || 4004, () => {
  Logger.info('Running at localhost:4004');
  Logger.success('Running at localhost:4004');
  Logger.warn('Running at localhost:4004');
  Logger.error('Running at localhost:4004');
});
