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
