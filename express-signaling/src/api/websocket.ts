/**
 * @fileoverview Defines websocket service.
 * @copyright Shingo OKAWA 2022
 */
import * as HTTP from 'http';
import * as Stream from 'stream';
import * as SafeJSON from '../utils/json';
import * as Payload from '../utils/payload';
import * as Signaling from '../utils/signaling';
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
      const id = typeof query.id === 'string' ? query.id : query.id[0];
      clients.set(id, conn);
      Logger.info(
        `Connected from client with query ${QueryString.stringify(query)}`
      );

      // Listening on messages.
      conn.on('message', (message: WebSocket.RawData): void => {
        const signal = SafeJSON.safeParse(Signaling.isValid)(Payload.toString(message));
        if (signal.hasError) {
          Logger.warn("Recieved malformed signal from client")
        } else {
          if (clients.has(signal.json.to)) {
            Logger.info(`Recieved message ${JSON.stringify(signal.json)}`);
            let client = clients.get(signal.json.to);
            client.send(Buffer.from(JSON.stringify(signal.json), 'utf-8'))
          } else {
            Logger.warn(`Destination client is not defined $(signal.json.to)`)
          }
        }
      });

      // Close the connection.
      conn.on('close', (): void => {
        Logger.info(`Disconnected from client ${id}`);
        clients.delete(id);
      });
    }
  );

  return wsServer;
};
