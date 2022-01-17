/**
 * @fileoverview Defines websocket payload utility functions.
 * @copyright Shingo OKAWA 2022
 */
import WebSocket from 'ws';

/** Predefined encoding types for {Buffer}. */
export type Encoding = 'utf8' | 'hex' | 'base64';

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
const isBuffer = (rawData: WebSocket.RawData): rawData is Buffer =>
  rawData instanceof Buffer;

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
export const toString = (rawData: WebSocket.RawData): string => {
  if (isBuffer(rawData)) return bufferToString(rawData);
  if (isArrayBuffer(rawData)) return arrayBufferToString(rawData);
  if (isBufferArray(rawData)) return bufferArrayToString(rawData);
  return undefined;
};
