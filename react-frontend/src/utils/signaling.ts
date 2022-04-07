/**
 * @fileoverview Defines WebSocket signaling helper functions.
 * @copyright Shingo OKAWA 2022
 */
import * as Console from './console';
import * as Types from './types';

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
