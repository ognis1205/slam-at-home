/**
 * @fileoverview Defines DOM helper classes/functions.
 * @copyright Shingo OKAWA 2021
 */
import * as ReactDOM from 'react-dom';
import * as Misc from './misc';

/** Returns `true` if DOM APIs are available. */
export const isDefined = (): boolean => {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
};

/** Returns `true` if a specified element is SVG. */
export const isSVG = (element: unknown): boolean => {
  return (
    typeof window.SVGElement !== 'undefined' &&
    element instanceof window.SVGElement
  );
};

/** A type union of HTML element identifiers. */
export type Identifier = string | HTMLElement | (() => HTMLElement);

/** Returns the element which is spefified with the indetifier */
export const get = (identifier: Identifier): HTMLElement => {
  if (!identifier || !isDefined()) return null;
  if (identifier instanceof HTMLElement) {
    return identifier;
  } else if (typeof identifier === 'string') {
    return document.getElementById(identifier);
  } else {
    return identifier();
  }
};

/** Returns the elements which are spefified with the indetifier */
export const select = (identifier: Identifier): HTMLElement[] => {
  if (!isDefined()) return [] as HTMLElement[];
  if (identifier) {
    if (identifier instanceof HTMLElement) return Misc.toArray(identifier);
    if (typeof identifier === 'string')
      return Misc.arrayFrom(document.querySelectorAll(identifier));
    if (typeof identifier === 'function') return Misc.toArray(identifier());
  }
  return Misc.toArray(document.body);
};

/** Returns if a node is a DOM node. Else will return by `findDOMNode`. */
export const find = <T = Element | Text>(
  node: React.ReactInstance | HTMLElement
): T => {
  if (!isDefined()) return undefined;
  if (node instanceof HTMLElement) return node as unknown as T;
  // eslint-disable-next-line react/no-find-dom-node
  return ReactDOM.findDOMNode(node) as unknown as T;
};

/** A cached scroll bar size. */
let selectorCache: string;

/** Returns `true` if a given selector finds an element whithin a specified element. */
export const match = (element: Node, selector: Identifier): boolean => {
  if (!selector || !isDefined()) return false;
  if (selector instanceof HTMLElement) {
    return element === selector;
  } else if (typeof selector === 'string') {
    if (!selectorCache)
      selectorCache = Misc.find(
        [
          'matches',
          'webkitMatchesSelector',
          'mozMatchesSelector',
          'msMatchesSelector',
          'oMatchesSelector',
        ],
        (key: string) => Misc.isFunction(element[key])
      );
    return !Misc.isFunction(element[selectorCache])
      ? false
      : element[selectorCache](selector);
  } else {
    return false;
  }
};

/** Returns `true` if a given selector finds an element whithin a specified element. */
export const matchRecursive = (
  element: Node,
  selector: Identifier,
  root: Node
): boolean => {
  let node = element;
  do {
    if (match(node, selector)) return true;
    if (node === root) return false;
    node = node.parentNode;
  } while (node);
  return false;
};

/** Returns the window size. */
export const getWindowSize = (): [number, number] => {
  if (!isDefined()) return undefined;
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  return [width, height];
};

/** Returns the window size. */
export const vw = (value: number): number => {
  if (!isDefined()) return undefined;
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  return Math.floor((width * value) / 100.0);
};

/** Returns the window size. */
export const vh = (value: number): number => {
  if (!isDefined()) return undefined;
  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  return Math.floor((height * value) / 100.0);
};

/** Returns the outer height of the element. */
export const getOuterHeight = (target: HTMLElement | SVGElement): number => {
  if (!isDefined()) return undefined;
  let height = target.clientHeight;
  const computedStyle =
    target.ownerDocument.defaultView.getComputedStyle(target);
  height += Misc.toInt(computedStyle.borderTopWidth);
  height += Misc.toInt(computedStyle.borderBottomWidth);
  return height;
};

/** Returns the outer width of the element. */
export const getOuterWidth = (target: HTMLElement | SVGElement): number => {
  if (!isDefined()) return undefined;
  let width = target.clientWidth;
  const computedStyle =
    target.ownerDocument.defaultView.getComputedStyle(target);
  width += Misc.toInt(computedStyle.borderLeftWidth);
  width += Misc.toInt(computedStyle.borderRightWidth);
  return width;
};

/** Returns the inner height of the element. */
export const getInnerHeight = (target: HTMLElement | SVGElement): number => {
  if (!isDefined()) return undefined;
  let height = target.clientHeight;
  const computedStyle =
    target.ownerDocument.defaultView.getComputedStyle(target);
  height -= Misc.toInt(computedStyle.paddingTop);
  height -= Misc.toInt(computedStyle.paddingBottom);
  return height;
};

/** Returns the inner width of the element. */
export const getInnerWidth = (target: HTMLElement | SVGElement): number => {
  if (!isDefined()) return undefined;
  let width = target.clientWidth;
  const computedStyle =
    target.ownerDocument.defaultView.getComputedStyle(target);
  width -= Misc.toInt(computedStyle.paddingLeft);
  width -= Misc.toInt(computedStyle.paddingRight);
  return width;
};

/** Adds `className` to a specified element. */
export const addClassName = (target: HTMLElement, className: string): void => {
  if (target.classList) target.classList.add(className);
  else if (!target.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`)))
    target.className += ` ${className}`;
  else return;
};

/** Removes `className` from a specified element. */
export const removeClassName = (
  target: HTMLElement,
  className: string
): void => {
  if (target.classList) target.classList.remove(className);
  else
    target.className = target.className.replace(
      new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'),
      ''
    );
};
