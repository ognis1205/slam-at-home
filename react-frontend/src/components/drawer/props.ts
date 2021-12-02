/**
 * @fileoverview Defines {Wrapper} and {Content} properties.
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
import * as Portal from '../portal';
import * as DOM from '../../utils/dom';

/** A type union of CSS position properties. */
type Placement = 'left' | 'top' | 'right' | 'bottom';

/** A type union of draw width definitions. */
type DrawWidth = number | [number, number];

/** A common properties shared by both {Wrapper} and {Content} components. */
interface Common extends Omit<React.HTMLAttributes<unknown>, 'onChange'> {
  prefixClass?: string;
  width?: string | number;
  height?: string | number;
  open?: boolean;
  defaultOpen?: boolean;
  handler?: React.ReactElement | null | false;
  placement?: Placement;
  drawLevel?: null | string | string[];
  drawWidth?:
    | DrawWidth
    | ((e: { target: HTMLElement; open: boolean }) => DrawWidth);
  drawDuration?: string;
  drawEase?: string;
  showMask?: boolean;
  maskClosable?: boolean;
  maskStyle?: React.CSSProperties;
  onChange?: (open?: boolean) => void;
  afterVisibleChange?: (open: boolean) => void;
  onHandleClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  keyboard?: boolean;
  contentWrapperStyle?: React.CSSProperties;
  autoFocus?: boolean;
}

/** A {Wrapper} component properties. */
export interface Wrapper extends Common {
  container?: DOM.Identifier;
  wrapperClass?: string;
  forceRender?: boolean;
}

/** A {Content} component properties. */
export interface Content extends Common, Portal.Context {
  visible?: boolean;
  afterClose?: () => void;
}
