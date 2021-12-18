/**
 * @fileoverview Defines event helper functions.
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

/** Makes CSS property prefixes map. */
const makePrefixMap = (style: string, event: string): Record<string, string> => {
  const prefixes: Record<string, string> = {};
  prefixes[style.toLowerCase()] = event.toLowerCase();
  prefixes[`Webkit${style}`] = `webkit${event}`;
  prefixes[`Moz${style}`] = `moz${event}`;
  prefixes[`ms${style}`] = `MS${event}`;
  prefixes[`O${style}`] = `o${event.toLowerCase()}`;
  return prefixes;
};

/** Holds a `animationend` event key value. */
export const ANIMATION_END_CSS: string =
  Object.keys(makePrefixMap('Animation', 'AnimationEnd')).filter(key => {
    if (typeof document === 'undefined')
      return false;
    const html = document.getElementsByTagName('html')[0];
    return key in (html ? html.style : {});
  })[0];

/** Holds a `transitionend` event key value. */
export const TRANSITION_END_CSS: string =
  Object.keys(makePrefixMap('Transition', 'TransitionEnd')).filter(key => {
    if (typeof document === 'undefined')
      return false;
    const html = document.getElementsByTagName('html')[0];
    return key in (html ? html.style : {});
  })[0];

/** A `animationend` event name. */
export const ANIMATION_END: string =
  makePrefixMap('Animation', 'AnimationEnd')[ANIMATION_END_CSS] || 'animationend';

/** A `transitionend` event name. */
export const TRANSITION_END: string =
  makePrefixMap('Transition', 'TransitionEnd')[TRANSITION_END_CSS] || 'transitionend';

/** Checks if the environment supports transition events. */
export const supportTransition = (): boolean => !!(
  ANIMATION_END && TRANSITION_END
);

/** Assigns a given event handler to a specified DOM. */
export const addListener = (
  target: HTMLElement,
  event: string,
  handler: (e: React.TouchEvent | TouchEvent | Event) => void,
  options?: any,
): void => {
  if (target.addEventListener) {
    target.addEventListener(event, handler, options);
  } else if ((target as any).attachEvent) {
    (target as any).attachEvent(`on${event}`, handler);
  }
};

/** Removes a given event handler from a apecified DOM. */
export const removeListener = (
  target: HTMLElement,
  event: string,
  handler: (e: React.TouchEvent | TouchEvent | Event) => void,
  options?: any,
): void => {
  if (target.removeEventListener) {
    target.removeEventListener(event, handler, options);
  } else if ((target as any).attachEvent) {
    (target as any).detachEvent(`on${event}`, handler);
  }
};
