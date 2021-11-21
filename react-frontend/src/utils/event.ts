/**
 * @fileoverview Defines event helper functions.
 */

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
export const addListener = (
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
export const removeListener = (
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
