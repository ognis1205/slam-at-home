/**
 * @fileoverview Defines websocket server.
 * @copyright Shingo OKAWA 2022
 */
import * as Express from 'express';
import * as ip from 'ip';
import WebSocket from 'ws';
import StartListening from './api/websocket';
import Logger from './utils/logger';
import Startup from './utils/startup';

/** Starts up services. */
Startup()
  .then(() => {
    /** The port number. */
    const port = process.env.PORT || 4000;

    /** References to the websocket connections. */
    const clients = new Map<string, WebSocket.WebSocket>();

    /** The express server. */
    const app = Express.default();

    // For pinging.
    app.get('/', (req: Express.Request, res: Express.Response): void => {
      Logger.info(`Pinged`);
      res.send({ uptime: process.uptime() });
    });

    /** Start listening on a given port. */
    const server = app.listen(port, () => {
      Logger.info(`Server running at http://${ip.address()}:${port}`);
    });

    /** Start listening websockets on a given port. */
    StartListening(server, clients);
  })
  .catch((error: Error) => {
    Logger.error(error);
  });
