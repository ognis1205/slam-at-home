/**
 * @fileoverview Defines type utilities.
 * @copyright Shingo OKAWA 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
