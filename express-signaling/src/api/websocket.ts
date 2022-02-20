/**
 * @fileoverview Defines websocket service.
 * @copyright Shingo OKAWA 2022
 */
import * as HTTP from 'http';
import * as Stream from 'stream';
import * as Signaling from '../utils/signaling';
import WebSocket from 'ws';

/** Instanciates {WebSocket.Server} from a given {HTTP.Server}. */
export default async (server: HTTP.Server): Promise<WebSocket.Server> => {
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
      const id = Signaling.onConnection(conn, req);

      conn.on('message', (message: WebSocket.RawData): void => {
        Signaling.onMessage(message);
      });

      conn.on('close', (): void => {
        Signaling.onClose(id);
      });
    }
  );

  return wsServer;
};
