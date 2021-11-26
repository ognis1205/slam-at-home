/**
 * @fileoverview Defines CSS helper functions.
 */

/** Checks if animation frame APIs are available. */
const isRAFAvailable: boolean =
  typeof window !== 'undefined' && 'requestAnimationFrame' in window;

/** Animation request/clear functions. */
const requestFrame: (callback: FrameRequestCallback) => number = (() => {
  return isRAFAvailable
       ? (callback: FrameRequestCallback): number => window.requestAnimationFrame(callback)
       : (callback: FrameRequestCallback): number => +setTimeout(callback, 16);
})();

/** Animation request/clear functions. */
const clearFrame: (identifier: number) => void = (() => {
  return isRAFAvailable
       ? (identifier: number): void => window.cancelAnimationFrame(identifier)
       : (identifier: number): void => clearTimeout(identifier);
})();

/** Holds the current global unique id. */
let uuid: number = 0;

/** Holds created locks so far. */
const ids = new Map<number, number>();

/** Deletes from `ids`. */
const cleanup = (id: number): boolean =>
  ids.delete(id);

/** Cancels an event which is specified by a given identifier. */
export const cancel = (identifier: number): void => {
  const id = ids.get(identifier);
  cleanup(id);
  return clearFrame(id);
};

/** Submits an event. */
export const submit = (callback: () => void, trial: number = 1): number => {
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
      ids.set(identifier, id);
    }
  }
  loop(trial);
  return identifier;
};
