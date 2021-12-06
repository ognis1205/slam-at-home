/**
 * @fileoverview Defines {Accordion} properties.
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
import type * as React from 'react';

/** Defines {Accordion} entries. */
interface JSONEntry<T> {
  value: T;
  icon?: React.ReactNode;
  options?: any;
}

/** Defines {Accordion} dividers. */
interface DividerJSON<T> extends JSONEntry<T> {
  divider: string;
}

/** Defines {Accordion} items. */
interface ItemJSON<T> extends JSONEntry<T> {
  label: string;
  children?: JSON<T>;
}

/** Defines JSON values for accordions. */
export type JSON<T> = Array<ItemJSON<T> | DividerJSON<T>>;

/** Defines {Divider} properties. */
export interface Divider<T> extends DividerJSON<T>, React.HTMLAttributes<unknown> {
  key: string;
  level: number;
}

/** Defines {Item} properties. */
export interface Item<T> extends Omit<ItemJSON<T>, 'children'>, Omit<React.HTMLAttributes<unknown>, 'onClick'> {
  key: string;
  level: number;
  onClick?: (entry: JSONEntry<T>) => void;
  children?: Array<React.ReactNode>;
}
