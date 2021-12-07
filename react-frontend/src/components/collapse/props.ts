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
import type * as Types from '../../utils/types';

/** Defines {Accordion} entries. */
interface JSONEntry<T> {
  style?: React.CSSProperties;
}

/** Defines {Accordion} dividers. */
export interface DividerJSON<T> extends JSONEntry<T> {
  divider: string;
}

/** Defines {Accordion} items. */
export interface ItemJSON<T> extends JSONEntry<T> {
  item: string;
  value?: T;
  icon?: React.ReactNode;
  options?: any;
  children?: JSON<T>;
}

/** Defines JSON values for accordions. */
export type JSON<T> = Array<ItemJSON<T> | DividerJSON<T>>;

/** Defines intermediate rendering nodes. */
type IntermediateDivider<T> = Types.Overwrite<DividerJSON<T>, {
  level: number;
}>;

/** Defines intermediate rendering nodes. */
type IntermediateItem<T> = Types.Overwrite<ItemJSON<T>, {
  level: number;
  onClick?: (entry: JSONEntry<T>) => void;
  children?: Array<React.ReactNode>;
}>;

/** Defines {Divider} properties. */
export type Divider<T> =
  Types.Overwrite<React.HTMLAttributes<HTMLDivElement>, IntermediateDivider<T>>;

/** Defines {Item} properties. */
export type Item<T> =
  Types.Overwrite<React.HTMLAttributes<HTMLDivElement>, IntermediateItem<T>>;

/** Defines {Accordion} properties. */
export type Collapse<T> = Types.Overwrite<React.HTMLAttributes<HTMLDivElement>, {
  items: JSON<T>;
  rtl?: boolean;
}>;
