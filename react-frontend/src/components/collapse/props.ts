/**
 * @fileoverview Defines {Collapse} properties.
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
import type * as Motion from '../motion';
import type * as Types from '../../utils/types';

/** Defines {Collapse} entries. */
type JSONEntry = Types.Overwrite<React.HTMLAttributes<HTMLDivElement>, {
  depth: number;
}>;

/** Defines {Collapse} dividers. */
export type DividerJSON = Types.Overwrite<JSONEntry, {
  divider: string;
}>;

/** Defines {Collapse} items. */
export type ItemJSON<T> = Types.Overwrite<JSONEntry, {
  item: string;
  open?: boolean;
  defaultOpen?: boolean;
  value?: T;
  icon?: React.ReactNode;
  options?: any;
  children?: JSON<T>;
}>;

/** Defines JSON values for collapses. */
export type JSON<T> = Array<ItemJSON<T> | DividerJSON>;

/** Defines {Divider} properties. */
export type Divider = DividerJSON;

/** Defines intermediate rendering nodes. */
export type Item<T> = Types.Overwrite<ItemJSON<T>, {
  onClick?: (value: T, options?: any) => void;
  children?: Array<React.ReactNode>;
}>;

/** Defines {Collapse} properties. */
export type Collapse<T> = Types.Overwrite<React.HTMLAttributes<HTMLDivElement>, {
  items: JSON<T>;
  rtl?: boolean;
}>;




/***/
export type CollapsibleType = 'header' | 'disabled';

/***/
export interface Common {
  className?: string;
  active?: boolean;
}

/***/
export interface Header extends Common {
  onClick?: (key: string | number) => void;
  panelKey?: string | number;
  showArrow?: boolean;
  collapsible?: CollapsibleType;
  icon?: (props: Header) => React.ReactNode;
  accordion?: boolean;
  extra?: string | React.ReactNode;
}

/***/
export interface Content extends Common {
  style?: object;
  role?: string;
  forceRender?: boolean;
}

/***/
export type Panel = Types.Overwrite<React.HTMLAttributes<HTMLDivElement>, Header & Content & {
  id?: string;
  className?: string;
  header?: string | React.ReactNode;
  headerClassName?: string;
  motion?: Motion.Props;
  destroyInactivePanel?: boolean;
}>;
