/**
 * @fileoverview Defines utility functions.
 */

/** A boolean constant which specifies `window` is defined or not. */
export const windowIsUndefined: boolean = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

/** Checks if a given value is numeric. */
export const isNumeric = (value: string | number | undefined) =>
  !isNaN(parseFloat(value as string)) && isFinite(value as number);

/** Drops specified keys from a given target. */
export const omit = <T extends object, K extends keyof T>(target: T, keys: K[]): Omit<T, K> => {
  const cloned = { ...target };
  if (Array.isArray(keys))
    keys.forEach(key => { delete cloned[key]; });
  return cloned;
}

/** Converts a given argument into array. */
export const toArray = (vars: any): any[] => {
  if (Array.isArray(vars))
    return vars;
  return [vars];
};

/** Returns `true` if the `container` has a scrolling bar. */
export const hasScrollBar = (container: HTMLElement): boolean => {
  return (container === document.body &&
          window.innerWidth - document.documentElement.clientWidth > 0) ||
         container.scrollHeight > container.clientHeight;
};

/** A cached scroll bar size. */
let cachedScrollBarSize: number;

/** Computes a scroll bar size if it is defined. */
export const getScrollBarSize = (fresh?: boolean): number => {
  if (typeof document === 'undefined') return 0;

  if (fresh || cachedScrollBarSize === undefined) {
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

    cachedScrollBarSize = container - scroll;
  }

  return cachedScrollBarSize;
};

/** A List of `transitionend` events with vendor prefixes. */
const transitionEndWithVendorPrefix: Record<string, string> = {
  transition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend',
};

/** Holds a `transitionend` event key value. */
export const transitionEndKey: string = Object.keys(transitionEndWithVendorPrefix).filter(key => {
  if (typeof document === 'undefined')
    return false;
  const html = document.getElementsByTagName('html')[0];
  return key in (html ? html.style : {});
})[0];

/** A `transitionend` event name. */
export const TRANSITION_END: string = transitionEndWithVendorPrefix[transitionEndKey];

/** Assigns a given event handler to a specified DOM. */
export const addEventListener = (
  target: HTMLElement,
  event: string,
  handler: (e: React.TouchEvent | TouchEvent | Event) => void,
  options?: any,
): void => {
  if (target.addEventListener) {
    target.addEventListener(event, handler, options);
  } else if ((target as any).attachEvent) {
    (target as any).attachEvent(`on${event}`, handler);
  }
};

/** Removes a given event handler from a apecified DOM. */
export const removeEventListener = (
  target: HTMLElement,
  event: string,
  handler: (e: React.TouchEvent | TouchEvent | Event) => void,
  options?: any,
): void => {
  if (target.removeEventListener) {
    target.removeEventListener(event, handler, options);
  } else if ((target as any).attachEvent) {
    (target as any).detachEvent(`on${event}`, handler);
  }
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
