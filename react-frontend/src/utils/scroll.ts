/**
 * @fileoverview Defines scrolling helper classes/functions.
 */
import * as React from 'react';
import * as CSS from './css';

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
const lockerCache = new Map<Element, React.CSSProperties>();

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

  /** Returns a bundled container. */
  public getContainer = (): HTMLElement | undefined => {
    return this.options?.container;
  };

  /** Locks a specified HTML element. */
  public lock = (): void => {
    if (locks.some(({target}: Lock) => target === this.target))
      return;

    if (locks.some(({options}: Lock) => options?.container === this.options?.container)) {
      locks = [...locks, { target: this.target, options: this.options }];
      return;
    }

    const container = this.options?.container || document.body;
    let size = 0;
    if (hasBar(container))
      size = getBarSize();

    lockerCache.set(
      container,
      CSS.set(
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

  /** Unlocks a specified HTML element. */
  public unlock = (): void => {
    const found = locks.find(({target}: Lock) => target === this.target);
    locks = locks.filter(({target}: Lock) => target !== this.target);

    if (!found || locks.some(({options}: Lock) => options?.container === found.options?.container))
      return;

    const container = this.options?.container || document.body;
    if (!classNameRegex.test(container.className))
      return;

    CSS.set(lockerCache.get(container), container);
    lockerCache.delete(container);
    container.className = container.className
      .replace(classNameRegex, '')
      .trim();
  };

  /** Updates lock options. */
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

/** Returns `true` if the `container` has a scrolling bar. */
export const hasBar = (container: HTMLElement): boolean => {
  return (container === document.body &&
          window.innerWidth - document.documentElement.clientWidth > 0) ||
         container.scrollHeight > container.clientHeight;
};

/** A cached scroll bar size. */
let barSizeCache: number;

/** Computes a scroll bar size if it is defined. */
export const getBarSize = (fresh?: boolean): number => {
  if (typeof document === 'undefined') return 0;

  if (fresh || barSizeCache === undefined) {
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    outer.style.position = 'absolute';
    outer.style.top = '0';
    outer.style.left = '0';
    outer.style.pointerEvents = 'none';
    outer.style.visibility = 'hidden';
    outer.style.width = '200px';
    outer.style.height = '150px';
    outer.style.overflow = 'hidden';

    outer.appendChild(inner);
    document.body.appendChild(outer);

    const container = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let scroll = inner.offsetWidth;
    if (container === scroll) scroll = outer.clientWidth;
    document.body.removeChild(outer);

    barSizeCache = container - scroll;
  }

  return barSizeCache;
};

/** Returns `true` if a given event is a `touch` event which attempts to scroll. */
export const isScrolling = (
  root: HTMLElement,
  target: HTMLElement | Document | null,
  dx: number,
  dy: number,
): boolean => {
  if (!target || target === document || target instanceof Document)
    return false;

  if (target === root.parentNode)
    return true;

  const scrollTop = target.scrollHeight - target.clientHeight;
  const scrollLeft = target.scrollWidth - target.clientWidth;
  const style = document.defaultView.getComputedStyle(target);
  const overflowY = style.overflowY === 'auto' || style.overflowY === 'scroll';
  const overflowX = style.overflowX === 'auto' || style.overflowX === 'scroll';

  const isY =
    Math.max(Math.abs(dx), Math.abs(dy)) === Math.abs(dy);
  const isX =
    Math.max(Math.abs(dx), Math.abs(dy)) === Math.abs(dx);
  const isScrollableY =
    scrollTop && overflowY;
  const isScrollableX =
    scrollLeft && overflowX;
  const isExceedingY =
    isScrollableY && ((target.scrollTop >= scrollTop && dy < 0) || (target.scrollTop <= 0 && dy > 0));
  const isExceedingX =
    isScrollableX && ((target.scrollLeft >= scrollLeft && dy < 0) || (target.scrollLeft <= 0 && dx > 0));
  const isParentScrollingY =
    isY && (!isScrollableY || isExceedingY);
  const isParentScrollingX =
    isX && (!isScrollableX || isExceedingX);

  if (isParentScrollingY || isParentScrollingX)
    return isScrolling(root, target.parentNode as HTMLElement, dx, dy);

  return false;
};

/** Returns `true` if `body` is overflowing. */
export const isBodyOverflowing = (): boolean =>
  (document.body.scrollHeight >
    (window.innerHeight || document.documentElement.clientHeight) &&
   window.innerWidth > document.body.offsetWidth);

/** @const @private Holds cached CSS properties of scroll effects. */
let effectCache: React.CSSProperties = {};

/** Switched scrolling effects. */
export const switchEffect = (close: boolean = false): void => {
  if (!isBodyOverflowing() && !close)
    return;

  const bodyClassName = document.body.className;
  if (close) {
    if (!classNameRegex.test(bodyClassName))
      return;
    CSS.set(effectCache);
    effectCache = {};
    document.body.className = bodyClassName
      .replace(classNameRegex, '')
      .trim();
    return;
  }

  const scrollBarSize = getBarSize();
  if (scrollBarSize) {
    effectCache = CSS.set({
      position: 'relative',
      width: `calc(100% - ${scrollBarSize}px)`,
    });
    if (!classNameRegex.test(bodyClassName))
      document.body.className = `${bodyClassName} ${className}`.trim();
  }
};
