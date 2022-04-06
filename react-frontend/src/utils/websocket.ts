/**
 * @fileoverview Defines WebSocket helper functions.
 * @copyright Shingo OKAWA 2022
 */

/** A type union of close event level properties. */
export const CloseLevel = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
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
        level: CloseLevel.INFO,
        message: '1000: closed normaly',
      } as CloseReason;
    case 1001:
      return {
        level: CloseLevel.WARNING,
        message: '1001: server down or browser navigated away',
      } as CloseReason;
    case 1002:
      return {
        level: CloseLevel.ERROR,
        message: '1002: terminated due to protocol error',
      } as CloseReason;
    case 1003:
      return {
        level: CloseLevel.ERROR,
        message: '1003: terminated due to malformed data',
      } as CloseReason;
    case 1004:
      return {
        level: CloseLevel.ERROR,
        message: '1004: unknown error',
      } as CloseReason;
    case 1005:
      return {
        level: CloseLevel.WARNING,
        message: '1005: no status code',
      } as CloseReason;
    case 1006:
      return {
        level: CloseLevel.ERROR,
        message: '1006: closed abnormally',
      } as CloseReason;
    case 1007:
      return {
        level: CloseLevel.ERROR,
        message: '1007: terminated due to malformed data',
      } as CloseReason;
    case 1008:
      return {
        level: CloseLevel.ERROR,
        message: '1008: terminated due to malformed data',
      } as CloseReason;
    case 1009:
      return {
        level: CloseLevel.ERROR,
        message: '1009: terminated due to malformed data',
      } as CloseReason;
    case 1010:
      return {
        level: CloseLevel.ERROR,
        message: '1010: failed to WebSocket handshake',
      } as CloseReason;
    case 1011:
      return {
        level: CloseLevel.ERROR,
        message: '1011: unexpected request',
      } as CloseReason;
    case 1015:
      return {
        level: CloseLevel.ERROR,
        message: '1015: failed to TLS handshake',
      } as CloseReason;
    default:
      return {
        level: CloseLevel.ERROR,
        message: 'unknown error',
      } as CloseReason;
  }
};
