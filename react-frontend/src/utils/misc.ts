/**
 * @fileoverview Defines miscellaneous functions.
 */

/** Checks if a given value is numeric. */
export const isNumeric = (value: string | number | undefined) =>
  !isNaN(parseFloat(value as string)) && isFinite(value as number);

/** Checks if a given value is primitive. */
export const isPrimitive = (value: unknown): boolean =>
  value == null || /^[sbn]/.test(typeof value)

/** Drops specified keys from a given target. */
export const omit = <T extends object, K extends keyof T>(target: T, keys: K[]): Omit<T, K> => {
  const cloned = { ...target };
  if (Array.isArray(keys))
    keys.forEach(key => { delete cloned[key]; });
  return cloned;
}

/** Converts a given argument into array. */
export const toArray = (vars: any): any[] =>
  Array.isArray(vars) ? vars : [vars];

/** Converts a given argument into array. */
export const arrayFrom = (vars: any): any[] => {
  return Array.from(vars);
};
