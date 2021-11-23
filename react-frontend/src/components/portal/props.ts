/**
 * @fileoverview Defines {Wrapper} and {Item} properties.
 */
import type * as React from 'react';
import * as DOM from '../../utils/dom';
import * as Scroll from '../../utils/scroll';

/** A {Item} component properties. */
export interface Item {
  container: DOM.Identifier;
  children?: React.ReactNode;
}

/** A {Content} component properties. */
export interface Content {
  container?: DOM.Identifier;
  getOpenCount?: () => number;
  scrollLocker?: Scroll.Locker;
  switchScrollingEffect?: () => void;
}

/** A {Wrapper} component properties. */
export interface Wrapper {
  container?: DOM.Identifier;
  wrapperClass?: string;
  visible?: boolean;
  forceRender?: boolean;
  children: (content: Content) => React.ReactNode;
}
