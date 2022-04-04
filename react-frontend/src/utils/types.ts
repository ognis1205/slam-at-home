/**
 * @fileoverview Defines type utilities.
 * @copyright Shingo OKAWA 2021
 */

/** Removes non-optional keys from a given type. */
export type OptionalKeys<T> = {
  [K in keyof T]-?: { [key: string]: never } extends { [_ in K]: T[_] }
    ? K
    : never;
}[keyof T];

/** Removes optional keys from a given type. */
export type RequiredKeys<T> = {
  [K in keyof T]-?: { [key: string]: never } extends { [_ in K]: T[_] }
    ? never
    : K;
}[keyof T];

/** Optional properties. */
export type OptionalRequiredProps<T> = { [P in RequiredKeys<T>]?: T[P] };

/** Properties without default values. */
export type RequiredProps<T, Defaults> = Pick<
  T,
  Exclude<keyof T, RequiredKeys<Defaults>>
>;

/** Wrapped properties with default values. */
export type WithDefaultProps<Props, Defaults> = RequiredProps<Props, Defaults> &
  OptionalRequiredProps<Defaults>;

/** Overwrites properties. */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

/** This type is responsible to declare that the type being passed is a class. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;
