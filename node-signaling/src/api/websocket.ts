/**
 * @fileoverview Defines websocket service.
 * @copyright Shingo OKAWA 2022
 */
import * as HTTP from 'http';
import * as Stream from 'stream';
import * as Payload from '../utils/payload';
import WebSocket from 'ws';
import QueryString from 'query-string';
import Logger from '../utils/logger';

/** Instanciates {WebSocket.Server} from a given {HTTP.Server}. */
export default async (server: HTTP.Server): Promise<WebSocket.Server> => {
  const wsServer = new WebSocket.Server({
    noServer: true,
    path: '/websockets',
  });

  // Performs the upgrade from a HTTP request to a WebSocket request.
  server.on(
    'upgrade',
    (req: HTTP.IncomingMessage, sock: Stream.Duplex, head: Buffer) => {
      wsServer.handleUpgrade(req, sock, head, (websocket: WebSocket.WebSocket) => {
        wsServer.emit('connection', websocket, req);
      });
    }
  );

  // Dispatches connection events on each web socket clients.
  wsServer.on(
    'connection',
    (conn: WebSocket.WebSocket, req: HTTP.IncomingMessage): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [path, params] = req?.url?.split('?');
      const query = QueryString.parse(params);
      Logger.info(QueryString.stringify(query));
      conn.on('message', (message: WebSocket.RawData) => {
        const json = JSON.parse(Payload.toString(message));
        Logger.info(JSON.stringify(json));
      });
    }
  );

  return wsServer;
};
