/**
 * @fileoverview Defines console helper functions.
 * @copyright Shingo OKAWA 2022
 */
import * as DOM from './dom';

/** Returns `true` if console.log isdefined. */
const isDefined = (): boolean => {
  if (
    DOM.isDefined() &&
    window.console &&
    console.log &&
    console.trace &&
    console.table &&
    console.time
  )
    return true;
  return false;
};

/** A type union of log levels. */
export const Level = {
  INFO: 'font-weight: bold;',
  TIME: 'font-weight: bold;',
  SUCCESS: 'font-weight: bold; color:green;',
  WARNING: 'font-weight: bold; color:orange;',
  ERROR: 'font-weight: bold; color:red;',
} as const;

export type Level = typeof Level[keyof typeof Level];

/** Logs info of a given message. */
export const info = (message: string, trace = false): void => {
  if (!isDefined()) return;
  if (trace) console.trace(`%c[INFO]`, Level.INFO, message);
  else console.log(`%c[INFO]`, Level.INFO, message);
};

/** Logs success of a given message. */
export const success = (message: string, trace = false): void => {
  if (!isDefined()) return;
  if (trace) console.trace(`%c[SUCCESS]`, Level.SUCCESS, message);
  else console.log(`%c[SUCCESS]`, Level.SUCCESS, message);
};

/** Logs warning of a given message. */
export const warning = (message: string, trace = false): void => {
  if (!isDefined()) return;
  if (trace) console.trace(`%c[WARNING]`, Level.WARNING, message);
  else console.log(`%c[WARNING]`, Level.WARNING, message);
};

/** Logs error of a given message. */
export const error = (message: string, trace = false): void => {
  if (!isDefined()) return;
  if (trace) console.trace(`%c[ERROR]`, Level.ERROR, message);
  else console.log(`%c[ERROR]`, Level.ERROR, message);
};

/** Logs time elapsed of a given task. */
export const time = (message: string, task: () => void): void => {
  if (!isDefined()) return;
  console.log(`%c[TIME]`, Level.TIME);
  console.time(`\t${message}`);
  task();
  console.timeEnd(`\t${message}`);
};
