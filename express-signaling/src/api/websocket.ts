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
export default async (
  server: HTTP.Server,
  clients: Map<string, WebSocket.WebSocket>
): Promise<WebSocket.Server> => {
  const wsServer = new WebSocket.Server({
    noServer: true,
    path: '/connect',
  });

  // Performs WebSocket handshake.
  server.on(
    'upgrade',
    (req: HTTP.IncomingMessage, sock: Stream.Duplex, head: Buffer) => {
      wsServer.handleUpgrade(
        req,
        sock,
        head,
        (websocket: WebSocket.WebSocket) => {
          wsServer.emit('connection', websocket, req);
        }
      );
    }
  );

  // Dispatches connection events on each web socket clients.
  wsServer.on(
    'connection',
    (conn: WebSocket.WebSocket, req: HTTP.IncomingMessage): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [path, params] = req?.url?.split('?');
      const query = QueryString.parse(params);
//      const clientId = query.clientId[0];
//      clients.set(clientId, conn);
      console.log(req.headers);
      console.log(req.socket.remoteAddress);
      Logger.info(
        `Connected from client with query ${QueryString.stringify(
          query
        )}`
      );

      // Listening on messages.
      conn.on('message', (message: WebSocket.RawData): void => {
        const json = JSON.parse(Payload.toString(message));
        Logger.info(
          `Recieved message ${JSON.stringify(json)} from client`
        );
      });

      // Close the connection.
      conn.on('close', (): void => {
//        clients.delete(clientId);
      });
    }
  );

  return wsServer;
};
