/**
 * @fileoverview Defines miscellaneous functions.
 */

/** A boolean constant which specifies `window` is defined or not. */
export const isWindowUndefined: boolean = !(
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
