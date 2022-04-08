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

/* JSON parse result. */
export type ParseResult<T> =
  | { json: T; hasError: false; error?: undefined }
  | { json?: undefined; hasError: true; error?: unknown };

/* Type guard for JSON. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, prettier/prettier
export const safeParse = <T>(guard: (value: any) => value is T) =>
  (text: string): ParseResult<T> => {
    const json = JSON.parse(text);
    return guard(json) ? { json, hasError: false } : { hasError: true };
  };
