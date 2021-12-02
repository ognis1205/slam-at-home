/**
 * @fileoverview Defines {Provider} and {Consumer} properties.
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
import * as DOM from '../../utils/dom';
import * as Scroll from '../../utils/scroll';

/** A {Consumer} component properties. */
export interface Consumer {
  container: DOM.Identifier;
  children?: React.ReactNode;
}

/** A {Content} component properties. */
export interface Context {
  container?: DOM.Identifier;
  getOpenCount?: () => number;
  scrollLocker?: Scroll.Locker;
  switchScrollingEffect?: () => void;
}

/** A {Provider} component properties. */
export interface Provider {
  container?: DOM.Identifier;
  wrapperClass?: string;
  visible?: boolean;
  forceRender?: boolean;
  children: (content: Context) => React.ReactNode;
}
