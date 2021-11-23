/**
 * @fileoverview Defines Item component.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Props from './props';
import * as DOM from '../../utils/dom';
import * as Hook from '../../utils/hook';

/** Counts opened portals. */
let openCount: number = 0;

/** A chached CSS `overflow`properties. */
let cachedOverflow: object = {};

/** Specifies whether the exucution context supports DOM or not. */
const isDOMSupported: boolean = DOM.isDefined();

/** Returns the container element of a portal wrapper. */
const getContainer = ({container}: Props.Wrapper): HTMLElement => {
  if (!isDOMSupported)
    return null;

  if (container) {
    if (container instanceof window.HTMLElement)
      return container;
    if (typeof container === 'string')
      return document.querySelectorAll(container)[0] as HTMLElement;
    if (typeof container === 'function')
      return container();
  }

  return document.body;
};

/** @private Test usage only */
export function getOpenCount(): number {
  return process.env.NODE_ENV === 'test' ? openCount : 0;
}

/**
 * Returns a `Item` component.
 * @param {Item} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Wrapper: React.FunctionComponent<Props.Wrapper> = (props: Props.Wrapper): React.ReactElement => {
  return null;
};
