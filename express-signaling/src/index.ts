/**
 * @fileoverview Defines websocket server.
 * @copyright Shingo OKAWA 2022
 */
import * as Express from 'express';
import * as ip from 'ip';
import * as Signaling from './utils/signaling';
import StartListening from './api/websocket';
import Logger from './utils/logger';
import Startup from './utils/startup';

/** Starts up services. */
Startup()
  .then(() => {
    /** The port number. */
    const port = process.env.PORT || 4000;

    /** The express server. */
    const app = Express.default();

    // For pinging.
    app.get('/', (req: Express.Request, res: Express.Response): void => {
      Logger.info(`Ping`);
      res.send({ uptime: process.uptime() });
    });

    // For clients list display.
    app.get('/peers', (req: Express.Request, res: Express.Response): void => {
      Logger.info(`Peers`);
      res.send({ peers: Signaling.listClients() });
    });

    /** Start listening on a given port. */
    const server = app.listen(port, () => {
      Logger.info(`Server running at http://${ip.address()}:${port}`);
    });

    /** Start listening websockets on a given port. */
    StartListening(server);
  })
  .catch((error: Error) => {
    Logger.error(error);
  });
