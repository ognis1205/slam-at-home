/**
 * @fileoverview Defines DOM helper classes/functions.
 */

/** A boolean constant which specifies `window` is defined or not. */
export const isWindowUndefined: boolean = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

/** Returns `true` if DOM APIs are available. */
export const isDefined = (): boolean => {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
};

/** A type union of HTML element identifiers. */
export type Identifier = string | HTMLElement | (() => HTMLElement);

/** Returns the element which is spefified with the indetifier */
export const get = (identifier: Identifier): HTMLElement => {
  if (identifier instanceof HTMLElement) {
    return identifier;
  } else if (typeof identifier === 'string') {
    return document.getElementById(identifier);
  } else {
    return identifier();
  }
};
