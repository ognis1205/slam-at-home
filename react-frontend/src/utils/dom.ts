/**
 * @fileoverview Defines DOM helper classes/functions.
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

/** A type union of HTML element identifiers. */
export type Identifier = string | HTMLElement | (() => HTMLElement);

/** Returns the element which is spefified with the indetifier */
export const get = (identifier: Identifier): HTMLElement => {
  if (!identifier || !isDefined())
    return null;
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
  if (!isDefined())
    return [] as HTMLElement[];
  if (identifier) {
    if (identifier instanceof HTMLElement)
      return Misc.toArray(identifier);
    if (typeof identifier === 'string')
      return Misc.arrayFrom(document.querySelectorAll(identifier));
    if (typeof identifier === 'function')
      return Misc.toArray(identifier());
  }
  return Misc.toArray(document.body);
};

/** Returns if a node is a DOM node. Else will return by `findDOMNode`. */
export const find = <T = Element | Text>(
  node: React.ReactInstance | HTMLElement,
): T => {
  if (!isDefined())
    return undefined;
  if (node instanceof HTMLElement)
    return (node as unknown) as T;
  return (ReactDOM.findDOMNode(node) as unknown) as T;
};

/** Returns the outer height of the element. */
export const getOuterHeight = (target: HTMLElement): number => {
  if (!isDefined())
    return undefined;
  let height = target.clientHeight;
  const computedStyle = target.ownerDocument.defaultView.getComputedStyle(target);
  height += Misc.toInt(computedStyle.borderTopWidth);
  height += Misc.toInt(computedStyle.borderBottomWidth);
  return height;
};

/** Returns the outer width of the element. */
export const getOuterWidth = (target: HTMLElement): number => {
  if (!isDefined())
    return undefined;
  let width = target.clientWidth;
  const computedStyle = target.ownerDocument.defaultView.getComputedStyle(target);
  width += Misc.toInt(computedStyle.borderLeftWidth);
  width += Misc.toInt(computedStyle.borderRightWidth);
  return width;
};

/** Returns the inner height of the element. */
export const getInnerHeight = (target: HTMLElement): number => {
  if (!isDefined())
    return undefined;
  let height = target.clientHeight;
  const computedStyle = target.ownerDocument.defaultView.getComputedStyle(target);
  height -= Misc.toInt(computedStyle.paddingTop);
  height -= Misc.toInt(computedStyle.paddingBottom);
  return height;
};

/** Returns the inner width of the element. */
export const getInnerWidth = (target: HTMLElement): number => {
  if (!isDefined())
    return undefined;
  let width = target.clientWidth;
  const computedStyle = target.ownerDocument.defaultView.getComputedStyle(target);
  width -= Misc.toInt(computedStyle.paddingLeft);
  width -= Misc.toInt(computedStyle.paddingRight);
  return width;
};
