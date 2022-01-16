/**
 * @fileoverview Defines websocket service.
 * @copyright Shingo OKAWA 2022
 */
import * as Express from 'express';
import * as HTTP from 'http';
import * as Stream from 'stream';
import * as Payload from '../utils/payload';
import WebSocket from 'ws';
import QueryString from 'query-string';
import Logger from '../utils/logger';

/** Instanciates {WebSocket.Server} from a given {HTTP.Server}. */
export default async (
  server: HTTP.Server,
  clients: Map<string, WebSocket.WebSocket>,
  sessionParser: Express.RequestHandler
): Promise<WebSocket.Server> => {
  const wsServer = new WebSocket.Server({
    noServer: true,
    path: '/connect',
  });

  // Performs the upgrade from a HTTP request to a WebSocket request.
  server.on(
    'upgrade',
    (req: Express.Request, sock: Stream.Duplex, head: Buffer) => {
      sessionParser(req, {} as Express.Response, (): void => {
        if (!req?.session?.clientId) {
          Logger.warn('Connection has not authorized');
          sock.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          sock.destroy();
          return;
        }
        wsServer.handleUpgrade(
          req,
          sock,
          head,
          (websocket: WebSocket.WebSocket) => {
            wsServer.emit('connection', websocket, req);
          }
        );
      });
    }
  );

  // Dispatches connection events on each web socket clients.
  wsServer.on(
    'connection',
    (conn: WebSocket.WebSocket, req: Express.Request): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [path, params] = req?.url?.split('?');
      const query = QueryString.parse(params);
      const clientId = req?.session?.clientId;
      clients.set(clientId, conn);
      Logger.info(
        `Connected from client ${clientId} with query ${QueryString.stringify(
          query
        )}`
      );

      // Listening on messages.
      conn.on('message', (message: WebSocket.RawData): void => {
        const json = JSON.parse(Payload.toString(message));
        Logger.info(
          `Recieved message ${JSON.stringify(json)} from client ${clientId}`
        );
      });

      // Close the connection.
      conn.on('close', (): void => {
        clients.delete(clientId);
      });
    }
  );

  return wsServer;
};
