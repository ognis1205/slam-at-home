/**
 * @fileoverview Defines Item component.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Item from './item';
import * as Props from './props';
import * as RAF from '../../utils/animation';
import * as DOM from '../../utils/dom';
import * as Hook from '../../utils/hook';
import * as Scroll from '../../utils/scroll';

/** Counts opened portals. */
let openCount: number = 0;

/** A chached CSS `overflow`properties. */
let cachedOverflow: object = {};

/** Returns the container element of a portal wrapper. */
const getContainer = ({container}: Props.Wrapper): HTMLElement => {
  const elems = DOM.select(container);
  return elems.length > 0 ? elems[0] : null;
};

/** @private Test usage only */
export const getOpenCount = (): number => {
  return process.env.NODE_ENV === 'test' ? openCount : 0;
}

/**
 * Returns a `Wrapper` component.
 * @param {Item} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Wrapper: React.FunctionComponent<Props.Wrapper> = (props: Props.Wrapper): React.ReactElement => {
  /** @const Holds a reference to the previous value of `props.visible`. */
  const prevVisible = Hook.usePrevious<boolean>(props.visible);

  /** @const Holds a reference to the previous value of `props.container`. */
  const prevContainer = Hook.usePrevious<DOM.Identifier>(props.container);

  /** @const Holds a reference to the container element. */
  const container = React.useRef<HTMLElement>(null);

  /** @const Holds a reference to the item element. */
  const item = React.useRef<Item.Ref>(null);

  /** @const Holds a reference to the `requestAnimationFrame` identifier. */
  const raf = React.useRef<number>(null);

  /** @const Holds a reference to the scroll locker. */
  const scrollLocker = React.useRef<Scroll.Locker>(null);

  return null;
};
