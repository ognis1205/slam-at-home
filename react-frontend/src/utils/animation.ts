/**
 * @fileoverview Defines CSS helper functions.
 * @copyright Shingo OKAWA 2021
 */

/** Checks if animation frame APIs are available. */
const IS_RAF_AVAILABLE: boolean =
  typeof window !== 'undefined' && 'requestAnimationFrame' in window;

/** Animation request/clear functions. */
const requestFrame: (callback: FrameRequestCallback) => number = (() => {
  return IS_RAF_AVAILABLE
    ? (callback: FrameRequestCallback) => window.requestAnimationFrame(callback)
    : (callback: FrameRequestCallback) => +setTimeout(callback, 16);
})();

/** Animation request/clear functions. */
const clearFrame: (identifier: number) => void = (() => {
  return IS_RAF_AVAILABLE
    ? (identifier: number) => window.cancelAnimationFrame(identifier)
    : (identifier: number) => clearTimeout(identifier);
})();

/** Holds the current global unique id. */
let uuid = 0;

/** Holds created locks so far. */
const IDS = new Map<number, number>();

/** Deletes from `ids`. */
const cleanup = (id: number): boolean => IDS.delete(id);

/** Cancels an event which is specified by a given identifier. */
export const clear = (identifier: number): void => {
  const id = IDS.get(identifier);
  cleanup(id);
  return clearFrame(id);
};

/** Submits an event. */
export const request = (callback: () => void, trial = 1): number => {
  uuid += 1;
  const identifier = uuid;
  function loop(ttl: number): void {
    if (ttl === 0) {
      cleanup(identifier);
      callback();
    } else {
      const id = requestFrame(() => {
        loop(ttl - 1);
      });
      IDS.set(identifier, id);
    }
  }
  loop(trial);
  return identifier;
};
