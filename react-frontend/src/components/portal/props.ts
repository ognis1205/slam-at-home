/**
 * @fileoverview Defines {Wrapper} and {Item} properties.
 */
import type * as React from 'react';
import * as DOM from '../../utils/dom';

/** A {Item} component properties. */
export interface Item {
  container: DOM.Identifier;
  children?: React.ReactNode;
}

/** Returns the container element of a portal item. */
export const getContainer = ({container}: Item): HTMLElement => {
  return DOM.get(container);
};
