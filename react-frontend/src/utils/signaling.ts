/**
 * @fileoverview Defines WebSocket signaling helper functions.
 * @copyright Shingo OKAWA 2022
 */
import * as Console from '../console';
import * as Types from '../Types';

/** Predefined encoding types for {Buffer}. */
export type Encoding = 'utf8' | 'hex' | 'base64';

/** A type union of websocket data types. */
export type Data = Buffer | ArrayBuffer | Buffer[];

/** {Buffer} to {string} converter. */
const bufferToString = (value: Buffer, encoding: Encoding = 'utf8'): string =>
  value.toString(encoding);

/** {ArrayBuffer} to {Buffer} converter. */
const arrayBufferToBuffer = (arrayBuffer: ArrayBuffer): Buffer =>
  Buffer.from(new Uint8Array(arrayBuffer));

/** {ArrayBuffer} to {Buffer} converter. */
const arrayBufferToString = (arrayBuffer: ArrayBuffer): string =>
  bufferToString(arrayBufferToBuffer(arrayBuffer));

/** {Buffer[]} to {Buffer} converter. */
const bufferArrayToString = (bufferArray: Buffer[]): string =>
  '[' + bufferArray.map((item: Buffer) => bufferToString(item)).join(',') + ']';

/** Type guard for {Buffer}. */
const isBuffer = (data: Data): data is Buffer =>
  data instanceof Buffer;

/** Type guard for {ArrayBuffer}. */
const isArrayBuffer = (rawData: WebSocket.RawData): rawData is ArrayBuffer =>
  rawData instanceof ArrayBuffer;

/** Type guard for {ArrayBuffer}. */
const isBufferArray = (rawData: WebSocket.RawData): rawData is ArrayBuffer => {
  if (Array.isArray(rawData))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawData.every((item: any) => item instanceof Buffer);
  return false;
};

/** Converts payload to string. */
export const toString = (data: Data): string => {
  if (isBuffer(data)) return bufferToString(data);
  if (isArrayBuffer(data)) return arrayBufferToString(data);
  if (isBufferArray(data)) return bufferArrayToString(data);
  return undefined;
};

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const isValid = (value: any): value is Signal =>
  'from' in value && 'to' in value && 'type' in value && 'payload' in value;

/** A signaling client protocol. */
export type Signaling = Types.Constructor<{
  onOpen?: (e: Event) => void;
  onClose?: (e: CloseEvent) => void;
  onMessage?: (e: MessageEvent) => void;
  onError?: (e: Event) => void;
}>;

/** A signaling client trait. */
export interface Client {
  connect: (url: string) => void;
  disconnect: () => void;
  send: () => void;
  isSignaling: () => boolean;
}

/** Returns a mixin of the signaling client trait. */
export function Mixin<BaseType extends Signaling>(
  Base: BaseType
): Client & BaseType {
  return class Mixin extends Base implements Client {
    private socket?: WebSocket;

    constructor() {
      // Placeholder.
    }

    /** Connects to the signaling server. */
    connect(url: string): void {
      const ws = new WebSocket(url);

      ws.onopen = (e: Event): void => {
        Console.info('opened connection to signaling server.');
        if (this.onOpen) this.onOpen(e);
      };

      ws.onclose = (e: CloseEvent): void => {
        Console.info('closed connection to signaling server.');
        if (this.onClose) this.onClose(e);
      };

      ws.onmessage = (e: MessageEvent): void => {
        Console.info(`message recieved: ${e.data}`);
        if (this.onMessage) this.onMessage(e);
      };

      ws.onerror = (e: Event): void => {
        Console.info('error occured.');
        if (this.onError) this.onError(e);
      };

      this.socket = ws;
    }

    /** Disconnects from the signaling server. */
    disconnect(): void {
      if (this.socket) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.socket.onclose = (e: CloseEvent) => {
          // Do nothing.
        };
        this.socket.close();
      }
      this.socket = null;
    }

    function send(type, sdp){
      var json = { from: user, to: user2, type: type, payload: sdp};
      ws.send(JSON.stringify(json));
      console.log("Sending ["+user+"] to ["+user2+"]: " + JSON.stringify(sdp));
    }

    /** Returns `true` if the client is connecting to the server. */
    isSignaling(): boolean {
      if (!this.socket) return false;
      return !(this.socket.readyState === WebSocket.CLOSED);
    }
  };
}
