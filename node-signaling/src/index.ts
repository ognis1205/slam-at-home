/**
 * @fileoverview Defines websocket server.
 * @copyright Shingo OKAWA 2022
 */
import * as Express from 'express';
import * as ip from 'ip';
import * as uuid from 'uuid';
import * as ExpressSession from 'express-session';
import WebSocket from 'ws';
import StartListening from './api/websocket';
import Logger from './utils/logger';
import Startup from './utils/startup';

/** Starts up services. */
Startup()
  .then(() => {
    /** The port number. */
    const port = process.env.PORT || 4000;

    /** The express session parser. */
    const session = ExpressSession.default({
      saveUninitialized: false,
      secret: '$eCuRiTy',
      resave: false,
    });

    /** References to the websocket connections. */
    const clients = new Map<string, WebSocket.WebSocket>();

    /** The express server. */
    const app = Express.default();

    // The express uses session.
    app.use(session);

    // For pinging.
    app.get('/', (req: Express.Request, res: Express.Response): void => {
      res.send({ uptime: process.uptime() });
    });

    // Login session.
    app.post('/login', (req: Express.Request, res: Express.Response): void => {
      const id = uuid.v4();
      Logger.info(`Updating session for client ${id}`);
      req.session.clientId = id;
      res.send({ result: 'OK', message: 'Session updated' });
    });

    // Logout session.
    app.delete(
      '/logout',
      (req: Express.Request, res: Express.Response): void => {
        const client = clients.get(req.session.clientId);
        Logger.info(`Destroying session for user ${req.session.clientId}`);
        req.session.destroy((): void => {
          if (client) client.close();
          res.send({ result: 'OK', message: 'Session destroyed' });
        });
      }
    );

    /** Start listening on a given port. */
    const server = app.listen(port, () => {
      Logger.info(`Server running at http://${ip.address()}:${port}`);
    });

    /** Start listening websockets on a given port. */
    StartListening(server, clients, session);
  })
  .catch((error: Error) => {
    Logger.error(error);
  });
