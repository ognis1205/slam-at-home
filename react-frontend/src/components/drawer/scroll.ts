/**
 * @fileoverview Defines scrolling helper classes/functions.
 */

/** Defines lock interface. */
interface Lock {
  target: typeof uuid;
  options: LockOptions;
}

/** Holds the current global unique id. */
let uuid: number = 0;

/** Holds created locks so far. */
let locks: Lock[] = [];

/** @const @private Holds a class name for scroll locker element. */
const className = 'ognis1205-scrolling-effect';

/** @const @private Holds a class name regexp for scroll locker element. */
const classNameRegex = new RegExp(`${className}`, 'g');


/** @export Defines scrolling lock options. */
export interface LockOptions {
  container: HTMLElement;
}

/**
 * Defines a scroll locker that manages a locking context.
 * @export @final
 */
export class Locker {
  /**
   * @param {LockOptions} options?
   */
  constructor(options?: LockOptions) {
    this.target = uuid++;
    this.options = options;
  }

  /** @private Holds a global unique identifier of this locker. */
  private target: typeof uuid;

  /** @private Holds a lock options which is given to this locker. */
  private options: LockOptions;
}
