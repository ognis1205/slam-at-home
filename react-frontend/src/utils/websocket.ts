/**
 * @fileoverview Defines WebSocket helper functions.
 * @copyright Shingo OKAWA 2022
 */

/** A type union of close event level properties. */
export const CloseLevel = {
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
} as const;

export type CloseLevel = typeof CloseLevel[keyof typeof CloseLevel];

/** A WebSocket close reason descriptor. */
export interface CloseReason {
  level: CloseLevel;
  message?: string;
}

/** Returns the reason of a given close event. */
export const reasonOf = (e: CloseEvent): CloseReason => {
  switch (e.code) {
    case 1000:
      return {
        level: CloseLevel.SUCCESS,
        message: '1000: WebSocket successfully closed',
      } as CloseReason;
    case 1001:
      return {
        level: CloseLevel.WARNING,
        message:
          '1001: An endpoint is "going away", this may occur due to server down or browser navigated away',
      } as CloseReason;
    case 1002:
      return {
        level: CloseLevel.ERROR,
        message:
          '1002: An endpoint is terminating the connection due to a protocol error',
      } as CloseReason;
    case 1003:
      return {
        level: CloseLevel.ERROR,
        message:
          '1003: An endpoint is terminating the connection because it has received a malformed type of data',
      } as CloseReason;
    case 1004:
      return {
        level: CloseLevel.ERROR,
        message:
          '1004: Unknown error, error code 1004 is reserved but not defined',
      } as CloseReason;
    case 1005:
      return {
        level: CloseLevel.WARNING,
        message: '1005: Unknonw error, no status code was actually present',
      } as CloseReason;
    case 1006:
      return {
        level: CloseLevel.ERROR,
        message:
          '1006: The connection was closed abnormally without sending or receiving a close control frame',
      } as CloseReason;
    case 1007:
      return {
        level: CloseLevel.ERROR,
        message:
          '1007: An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message',
      } as CloseReason;
    case 1008:
      return {
        level: CloseLevel.ERROR,
        message:
          '1008: An endpoint is terminating the connection because it has received a message that "violates its policy',
      } as CloseReason;
    case 1009:
      return {
        level: CloseLevel.ERROR,
        message:
          '1009: An endpoint is terminating the connection because it has received a message that is too big for it to process',
      } as CloseReason;
    case 1010:
      return {
        level: CloseLevel.ERROR,
        message:
          '1010: An endpoint is terminating the connection because the server did not return in the response message of the WebSocket handshake',
      } as CloseReason;
    case 1011:
      return {
        level: CloseLevel.ERROR,
        message:
          '1011: A server is terminating the connection because it encountered an unexpected condition',
      } as CloseReason;
    case 1015:
      return {
        level: CloseLevel.ERROR,
        message:
          '1015: The connection was closed due to a failure to perform a TLS handshake',
      } as CloseReason;
    default:
      return {
        level: CloseLevel.ERROR,
        message: 'Unknown error',
      } as CloseReason;
  }
};

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
const isBuffer = (data: Data): data is Buffer => data instanceof Buffer;

/** Type guard for {ArrayBuffer}. */
const isArrayBuffer = (data: Data): data is ArrayBuffer =>
  data instanceof ArrayBuffer;

/** Type guard for {ArrayBuffer}. */
const isBufferArray = (data: Data): data is ArrayBuffer => {
  if (Array.isArray(data))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.every((item: any) => item instanceof Buffer);
  return false;
};

/** Converts payload to string. */
export const toString = (data: Data): string => {
  if (isBuffer(data)) return bufferToString(data);
  if (isArrayBuffer(data)) return arrayBufferToString(data);
  if (isBufferArray(data)) return bufferArrayToString(data);
  return undefined;
};

/** A type union of signal type properties. */
export const SignalType = {
  ICE_CANDIDATE: 'IceCandidate',
  SESSION_DESCRIPTION: 'SessionDescription',
  NEW_CONNECTION: 'NewConnection',
  DISCONNECTION: 'Disconnection',
  LIST_REMOTE_PEERS: 'ListRemotePeers',
} as const;

export type SignalType = typeof SignalType[keyof typeof SignalType];

/** Signal data format. */
export type Signal = {
  from: string;
  to: string;
  type: SignalType;
  payload: unknown;
};

/** Client description format. */
export type ClientDescription = {
  id: string;
  name: string;
};

/** Validate this value with a custom type guard. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const isSignal = (value: any): value is Signal =>
  'from' in value && 'to' in value && 'type' in value && 'payload' in value;

/** Sends a given SDP over a specified WebSocket. */
export const send = (
  sock: WebSocket,
  from: string,
  to: string,
  type: SignalType,
  sdp: RTCSessionDescriptionInit
): void =>
  sock.send(
    JSON.stringify({
      from: from,
      to: to,
      type: type,
      payload: sdp,
    })
  );
