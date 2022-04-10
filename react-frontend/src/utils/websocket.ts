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
        message: '(1000) Closed WebSocket successfully',
      } as CloseReason;
    case 1001:
      return {
        level: CloseLevel.WARNING,
        message: '(1001) Server down or remote client navigated away',
      } as CloseReason;
    case 1002:
      return {
        level: CloseLevel.ERROR,
        message: '(1002) Protocol error occured while closing connection',
      } as CloseReason;
    case 1003:
      return {
        level: CloseLevel.ERROR,
        message: '(1003) Terminated connection due to malformed type of data',
      } as CloseReason;
    case 1004:
      return {
        level: CloseLevel.ERROR,
        message: '(1004) Unknown error',
      } as CloseReason;
    case 1005:
      return {
        level: CloseLevel.WARNING,
        message: '(1005) Unknonw error',
      } as CloseReason;
    case 1006:
      return {
        level: CloseLevel.ERROR,
        message:
          '(1006) Closed connection abnormally without sending or receiving close control frame',
      } as CloseReason;
    case 1007:
      return {
        level: CloseLevel.ERROR,
        message:
          '(1007) Terminated connection due to inconsistent type of message',
      } as CloseReason;
    case 1008:
      return {
        level: CloseLevel.ERROR,
        message: '(1008) Terminated connection due to policy violating message',
      } as CloseReason;
    case 1009:
      return {
        level: CloseLevel.ERROR,
        message:
          '(1009) Terminated connection because due to exceeding limit of data',
      } as CloseReason;
    case 1010:
      return {
        level: CloseLevel.ERROR,
        message:
          '(1010) Terminated connection because due to failure to perform WebSocket handshake',
      } as CloseReason;
    case 1011:
      return {
        level: CloseLevel.ERROR,
        message: '(1011) Terminated connection due to unexpected condition',
      } as CloseReason;
    case 1015:
      return {
        level: CloseLevel.ERROR,
        message:
          '(1015) Closed connection due to failure to perform TLS handshake',
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
