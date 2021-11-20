/**
 * @fileoverview Defines scrolling helper classes/functions.
 */
import * as React from 'react';
import * as Utils from './utils';
import * as Style from './style';

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

/** @const @private Holds cached CSS properties of containers. */
const cachedStyle = new Map<Element, React.CSSProperties>();

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

  /**
   * Locks a specified HTML element.
   */
  public lock = (): void => {
    if (locks.some(({target}: Lock) => target === this.target))
      return;

    if (locks.some(({options}: Lock) => options?.container === this.options?.container)) {
      locks = [...locks, { target: this.target, options: this.options }];
      return;
    }

    const container = this.options?.container || document.body;
    let size = 0;
    if (Utils.hasScrollBar(container))
      size = Utils.getScrollBarSize();

    cachedStyle.set(
      container,
      Style.set(
        {
          width: size !== 0 ? `calc(100% - ${size}px)` : undefined,
          overflow: 'hidden',
          overflowX: 'hidden',
          overflowY: 'hidden',
        } as React.CSSProperties,
        container,
      ),
    );

    if (!classNameRegex.test(container.className))
      container.className = `${container.className} ${className}`.trim();

    locks = [...locks, { target: this.target, options: this.options }];
  };

  /**
   * Unlocks a specified HTML element.
   */
  public unlock = (): void => {
    const found = locks.find(({target}: Lock) => target === this.target);
    locks = locks.filter(({target}: Lock) => target !== this.target);

    if (!found || locks.some(({options}: Lock) => options?.container === found.options?.container))
      return;

    const container = this.options?.container || document.body;
    if (!classNameRegex.test(container.className))
      return;

    Style.set(cachedStyle.get(container), container);
    cachedStyle.delete(container);
    container.className = container.className
      .replace(classNameRegex, '')
      .trim();
  };

  /**
   * Updates lock options.
   * @param {LockOptions} options? a new options which is assigned to this lock.
   */
  public relock = (options?: LockOptions): void => {
    const found = locks.find(({ target }) => target === this.target);
    if (found)
      this.unlock();

    this.options = options;
    if (found) {
      found.options = options;
      this.lock();
    }
  };
}
