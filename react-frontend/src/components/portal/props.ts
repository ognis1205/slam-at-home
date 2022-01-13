/**
 * @fileoverview Defines {Wrapper} and {Portal} properties.
 * @copyright Shingo OKAWA 2021
 */
import type * as React from 'react';
import * as DOM from '../../utils/dom';
import * as Scroll from '../../utils/scroll';

/** A type union of CSS position properties. */
type Children =
  | ((context: WrapperContext) => React.ReactNode)
  | React.ReactNode;

/** A {Portal} component properties. */
export interface Portal {
  container: DOM.Identifier;
  children?: React.ReactNode;
}

/** A {Content} component properties. */
export interface WrapperContext {
  container?: DOM.Identifier;
  getOpenCount?: () => number;
  scrollLocker?: Scroll.Locker;
  switchScrollingEffect?: () => void;
}

/** A {Wrapper} component properties. */
export interface Wrapper {
  container?: DOM.Identifier;
  className?: string;
  visible?: boolean;
  forceRender?: boolean;
  children: Children;
}
