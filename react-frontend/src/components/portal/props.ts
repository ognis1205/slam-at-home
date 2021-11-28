/**
 * @fileoverview Defines {Provider} and {Consumer} properties.
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
