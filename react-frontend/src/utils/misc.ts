/**
 * @fileoverview Defines miscellaneous functions.
 * @copyright Shingo OKAWA 2021
 */

/** Checks if a given value is numeric. */
export const isNumeric = (value: string | number | undefined): boolean =>
  !isNaN(parseFloat(value as string)) && isFinite(value as number);

/** Checks if a given value is primitive. */
export const isPrimitive = (value: unknown): boolean =>
  value == null || /^[sbn]/.test(typeof value);

/** Checks if a given value is function. */
export const isFunction = (value: unknown): boolean =>
  typeof value === 'function' ||
  Object.prototype.toString.call(value) === '[object Function]';

/** Drops specified keys from a given target. */
export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  target: T,
  keys: K[]
): Omit<T, K> => {
  const cloned = { ...target };
  if (Array.isArray(keys))
    keys.forEach((key) => {
      delete cloned[key];
    });
  return cloned;
};

/** Converts a given argument into array. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toArray = (vars: unknown): any[] =>
  Array.isArray(vars) ? vars : [vars];

/** Converts a given argument into array. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const arrayFrom = (vars: ArrayLike<any>): any[] => {
  return Array.from(vars);
};

/** Finds an element which is specified with a given condition. */
export const find = <T>(array: Array<T>, condition: (key: T) => boolean): T => {
  for (let i = 0, length = array.length; i < length; i++)
    if (condition.apply(condition, [array[i]])) return array[i];
};

/** Converts a string to int. */
export const toInt = (a: string): number => parseInt(a, 10);

/** Sorts a given array as an array of numbers. */
export const sort = (array: Array<number | string>): Array<number | string> =>
  [...array].sort((l, r) => Number(l) - Number(r));
