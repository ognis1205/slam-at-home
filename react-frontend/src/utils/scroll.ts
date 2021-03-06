/**
 * @fileoverview Defines scrolling helper classes/functions.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as CSS from './css';
import styles from '../assets/styles/utils/scroll.module.scss';

/** Defines lock interface. */
interface Lock {
  target: typeof uuid;
  options: LockOptions;
}

/** Holds the current global unique id. */
let uuid = 0;

/** Holds created locks so far. */
let locks: Lock[] = [];

/** @const @private Holds a class name for scroll locker element. */
const CLASS_NAME = styles['scroll'];

/** @const @private Holds a class name regexp for scroll locker element. */
const CLASS_NAME_REGEX = new RegExp(`${CLASS_NAME}`, 'g');

/** @const @private Holds cached CSS properties of containers. */
const LOCKER_CACHE = new Map<Element, React.CSSProperties>();

/** @export Defines scrolling lock options. */
export interface LockOptions {
  container: HTMLElement;
}

/** Defines a scroll locker that manages a locking context. */
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
    if (locks.some(({ target }: Lock) => target === this.target)) return;

    if (
      locks.some(
        ({ options }: Lock) => options?.container === this.options?.container
      )
    ) {
      locks = [...locks, { target: this.target, options: this.options }];
      return;
    }

    const container = this.options?.container || document.body;
    let size = 0;
    if (hasBar(container)) size = getBarSize();

    LOCKER_CACHE.set(
      container,
      CSS.set(
        {
          width: size !== 0 ? `calc(100% - ${size}px)` : undefined,
          overflow: 'hidden',
          overflowX: 'hidden',
          overflowY: 'hidden',
        } as React.CSSProperties,
        container
      )
    );

    if (!CLASS_NAME_REGEX.test(container.className))
      container.className = `${container.className} ${CLASS_NAME}`.trim();

    locks = [...locks, { target: this.target, options: this.options }];
  };

  /** Unlocks a specified HTML element. */
  public unlock = (): void => {
    const found = locks.find(({ target }: Lock) => target === this.target);
    locks = locks.filter(({ target }: Lock) => target !== this.target);

    if (
      !found ||
      locks.some(
        ({ options }: Lock) => options?.container === found.options?.container
      )
    )
      return;

    const container = this.options?.container || document.body;
    if (!CLASS_NAME_REGEX.test(container.className)) {
      return;
    }

    CSS.set(LOCKER_CACHE.get(container), container);
    LOCKER_CACHE.delete(container);
    container.className = container.className
      .replace(CLASS_NAME_REGEX, '')
      .trim();
  };

  /** Updates lock options. */
  public relock = (options?: LockOptions): void => {
    const found = locks.find(({ target }) => target === this.target);
    if (found) this.unlock();

    this.options = options;
    if (found) {
      found.options = options;
      this.lock();
    }
  };
}

/** Returns `true` if the `container` has a scrolling bar. */
export const hasBar = (container: HTMLElement): boolean => {
  const bodyHasScrollBar =
    container === document.body &&
    window.innerWidth - document.documentElement.clientWidth > 0;
  const containerHasScrollBar = container.scrollHeight > container.clientHeight;
  return bodyHasScrollBar || containerHasScrollBar;
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
  dy: number
): boolean => {
  if (!target || target === document || target instanceof Document)
    return false;

  if (target === root.parentNode) return true;

  const scrollTop = target.scrollHeight - target.clientHeight;
  const scrollLeft = target.scrollWidth - target.clientWidth;
  const style = document.defaultView.getComputedStyle(target);
  const overflowY = style.overflowY === 'auto' || style.overflowY === 'scroll';
  const overflowX = style.overflowX === 'auto' || style.overflowX === 'scroll';

  const isY = Math.max(Math.abs(dx), Math.abs(dy)) === Math.abs(dy);
  const isX = Math.max(Math.abs(dx), Math.abs(dy)) === Math.abs(dx);
  const isScrollableY = scrollTop && overflowY;
  const isScrollableX = scrollLeft && overflowX;
  const isExceedingY =
    isScrollableY &&
    ((target.scrollTop >= scrollTop && dy < 0) ||
      (target.scrollTop <= 0 && dy > 0));
  const isExceedingX =
    isScrollableX &&
    ((target.scrollLeft >= scrollLeft && dy < 0) ||
      (target.scrollLeft <= 0 && dx > 0));
  const isParentScrollingY = isY && (!isScrollableY || isExceedingY);
  const isParentScrollingX = isX && (!isScrollableX || isExceedingX);

  if (isParentScrollingY || isParentScrollingX)
    return isScrolling(root, target.parentNode as HTMLElement, dx, dy);

  return false;
};

/** Returns `true` if `body` is overflowing. */
export const isBodyOverflowing = (): boolean => {
  const bodyHasExcessHeight =
    document.body.scrollHeight >
    (window.innerHeight || document.documentElement.clientHeight);
  const bodyHasScrollBar = window.innerWidth > document.body.offsetWidth;
  return bodyHasExcessHeight && bodyHasScrollBar;
};

/** @const @private Holds cached CSS properties of scroll effects. */
let EFFECT_CACHE: React.CSSProperties = {};

/** Switched scrolling effects. */
export const switchEffect = (close = false): void => {
  if (!isBodyOverflowing() && !close) return;

  const bodyClassName = document.body.className;
  if (close) {
    if (!CLASS_NAME_REGEX.test(bodyClassName)) return;
    CSS.set(EFFECT_CACHE);
    EFFECT_CACHE = {};
    document.body.className = bodyClassName
      .replace(CLASS_NAME_REGEX, '')
      .trim();
    return;
  }

  const scrollBarSize = getBarSize();
  if (scrollBarSize) {
    EFFECT_CACHE = CSS.set({
      position: 'relative',
      width: `calc(100% - ${scrollBarSize}px)`,
    });
    if (!CLASS_NAME_REGEX.test(bodyClassName))
      document.body.className = `${bodyClassName} ${CLASS_NAME}`.trim();
  }
};
