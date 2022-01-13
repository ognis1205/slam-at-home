/**
 * @fileoverview Defines JSON types.
 * @copyright Shingo OKAWA 2021
 */

/** Defines primitive types. */
export type Primitive = string | number | boolean | null;

/** Defines JSON objects. */
export interface Obj {
  [key: string]: Value;
}

/** Defines JSON lists. */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface List extends Array<Value> {
  // Nothing declared.
}

/** Defines JSON values. */
export type Value = Primitive | Obj | List;
