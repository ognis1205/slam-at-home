/**
 * @fileoverview Defines utility functions.
 */

/** A boolean constant which specifies `window` is defined or not. */
export const windowIsUndefined: boolean = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

/** Converts a given argument into array. */
export const toArray = (vars: any): any[] => {
  if (Array.isArray(vars))
    return vars;
  return [vars];
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
