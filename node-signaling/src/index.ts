/**
 * @fileoverview Defines websocket server.
 * @copyright Shingo OKAWA 2021
 */
import * as Express from 'express';
import * as ip from 'ip';
import WebSocket from './api/websocket';
import Logger from './utils/logger';
import Startup from './utils/startup';

/** Starts up services. */
Startup()
  .then(() => {
    const port = process.env.PORT || 4000;
    const server = Express.default().listen(port, () => {
      Logger.info(`Server running at http://${ip.address()}:${port}\n\n`);
    });
    WebSocket(server);
  })
  .catch((error: Error) => {
    Logger.error(error);
  });

//const app = express.default();

//app.get('/', (_req, res) => {
//  res.send({ uptime: process.uptime() });
//});

//const server = http.createServer(app);
//const io = new socketio.Server(server);

//io.on('connection', (...params) => {
//  console.log(params);
//});

//server.listen(process.env.port || 4004, () => {
//  Logger.info('Running at localhost:4004');
//  Logger.success('Running at localhost:4004');
//  Logger.warn('Running at localhost:4004');
//  Logger.error('Running at localhost:4004');
//});
