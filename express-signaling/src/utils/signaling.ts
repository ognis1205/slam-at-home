/**
 * @fileoverview Defines logger class.
 * @copyright Shingo OKAWA 2022
 */
import * as HTTP from 'http';
import * as SafeJSON from '../utils/json';
import * as Payload from '../utils/payload';
import WebSocket from 'ws';
import QueryString from 'query-string';
import Logger from '../utils/logger';

/** Signal data format. */
export type Signal = {
  from: string;
  to: string;
  type: string;
  payload: string;
};

/** Client description format. */
export type ClientDescription = {
  id: string;
  name: string;
};

/** Validate this value with a custom type guard. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValid = (value: any): value is Signal =>
  'from' in value && 'to' in value && 'type' in value && 'payload' in value;

/** Returns the remote address of the request. */
export const getId = (req: HTTP.IncomingMessage): string | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [path, params] = req?.url?.split('?');
  const query = QueryString.parse(params);
  if (
    'id' in query &&
    (typeof query.id === 'string' || Array.isArray(query.id))
  )
    return typeof query.id === 'string' ? query.id : query.id[0].toString();
  return undefined;
};

/** Returns the remote address of the request. */
export const getAddress = (req: HTTP.IncomingMessage): string =>
  req.socket.remoteAddress;

/** Returns the user agent of the request. */
export const getUserAgent = (req: HTTP.IncomingMessage): string =>
  req.headers['user-agent'];

/* Client identifier type. */
type ClientId = string;

/* Client identifier type. */
type ClientName = string;

/** Defines a client class. */
class Client {
  /**
   * @param {LockOptions} options?
   */
  constructor(
    id: ClientId,
    conn: WebSocket.WebSocket,
    req: HTTP.IncomingMessage
  ) {
    this.id = id;
    const addr = getAddress(req);
    const user = getUserAgent(req).split(/[ ,]+/)[0];
    this.name = `${user}(${addr})`;
    this.connection = conn;
  }

  /** @private Holds a global unique identifier of this client. */
  private id: ClientId;

  /** @private Holds a display name of the client. */
  private name: ClientName;

  /** @private Holds a WebSocket connection which is given to this client. */
  private connection: WebSocket.WebSocket;

  /** Sends a buffer to the socket. */
  public send(buffer: Buffer): void {
    this.connection.send(buffer);
  }

  /** Returns JSON object. */
  public toJson(): ClientDescription {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

/** @const @private Holds a subscribed clients. */
const CLIENTS = new Map<ClientId, Client>();

/** Registers new connected web socket. */
export const onConnection = (
  conn: WebSocket.WebSocket,
  req: HTTP.IncomingMessage
): ClientId | undefined => {
  const id = getId(req);
  if (id !== undefined) {
    if (CLIENTS.has(id)) {
      Logger.info(`Disconnected from client ${id}`);
      CLIENTS.delete(id);
    }
    CLIENTS.set(id, new Client(id, conn, req));
    Logger.info(`Connected from client ${id}`);
    return id;
  } else {
    Logger.warn('Failed to acquire client id');
    return undefined;
  }
};

/** Registers new connected web socket. */
export const onMessage = (message: WebSocket.RawData): void => {
  const signal = SafeJSON.safeParse(isValid)(Payload.toString(message));
  if (signal.hasError) {
    Logger.warn('Recieved malformed signal from client');
  } else {
    if (CLIENTS.has(signal.json.to)) {
      Logger.info(`Recieved message ${JSON.stringify(signal.json)}`);
      const client = CLIENTS.get(signal.json.to);
      client.send(Buffer.from(JSON.stringify(signal.json), 'utf-8'));
    } else {
      Logger.warn(`Destination client is not defined ${signal.json.to}`);
    }
  }
};

/** Deletes a connected web socket. */
export const onClose = (id: ClientId | undefined): void => {
  if (id !== undefined) {
    Logger.info(`Disconnected from client ${id}`);
    CLIENTS.delete(id);
  }
};

/** Returns client list. */
export const listClients = (): ClientDescription[] =>
  Array.from(CLIENTS.values()).map((c) => c.toJson());
