/**
 * @fileoverview Defines WebSocket signaling helper functions.
 * @copyright Shingo OKAWA 2022
 */
import * as Console from '../console';
import * as Types from '../Types';

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
    }

    /** Returns `true` if the client is connecting to the server. */
    isSignaling(): boolean {
      if (!this.socket) return false;
      return !(this.socket.readyState === WebSocket.CLOSED);
    }
  };
}
