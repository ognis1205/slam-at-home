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

/** Defines collapsible types. */
export type CollapsibleType = 'header' | 'disabled';

/** Defines common properties. */
export interface Common {
  className?: string;
  active?: boolean;
}

/** Defines {Panel.Header} properties. */
export interface Header extends Common {
  onClick?: (key: string | number) => void;
  panelKey?: string | number;
  showArrow?: boolean;
  collapsible?: CollapsibleType;
  accordion?: boolean;
  arrow?: (props: Header) => React.ReactNode;
  icon?: string | React.ReactNode;
}

/** Defines {Panel.Content} properties. */
export interface Content extends Common {
  style?: object;
  role?: string;
  forceRender?: boolean;
}

/** Defines {Panel} properties. */
export type Panel = Types.Overwrite<Header & Content, {
  id?: string;
  className?: string;
  children?: React.ReactNode;
  header?: string | React.ReactNode;
  headerClassName?: string;
  motion?: Motion.Props;
  destroyInactivePanel?: boolean;
}>;

/** Defines {Wrapper} properties. */
export type Wrapper = Types.Overwrite<React.HTMLAttributes<HTMLDivElement>, {
  className?: string;
  style?: object;
  children?: React.ReactNode;
  onChange?: (key: React.Key | React.Key[]) => void;
  motion?: Motion.Props;
  accordion?: boolean;
  activeKey?: React.Key | React.Key[];
  defaultActiveKey?: React.Key | React.Key[];
  destroyInactivePanel?: boolean;
  expand?: (props: object) => React.ReactNode;
  collapsible?: CollapsibleType;
}>;
