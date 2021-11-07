/**
 * @fileoverview Defines utility functions.
 */

/** A boolean constant which specifies `window` is defined or not. */
export const windowIsDefined: boolean = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
