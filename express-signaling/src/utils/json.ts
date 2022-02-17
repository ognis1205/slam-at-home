/**
 * @fileoverview Defines logger class.
 * @copyright Shingo OKAWA 2022
 */

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
