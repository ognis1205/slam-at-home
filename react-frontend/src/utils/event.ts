/**
 * @fileoverview Defines event helper functions.
 * @copyright Shingo OKAWA 2021
 */
import * as Types from './types';

/** General purpose event handlers. */
export type Handler<T> = (e: T) => void | false;

/** Makes CSS property prefixes map. */
const makePrefixMap = (
  style: string,
  event: string
): Record<string, string> => {
  const prefixes: Record<string, string> = {};
  prefixes[style.toLowerCase()] = event.toLowerCase();
  prefixes[`Webkit${style}`] = `webkit${event}`;
  prefixes[`Moz${style}`] = `moz${event}`;
  prefixes[`ms${style}`] = `MS${event}`;
  prefixes[`O${style}`] = `o${event.toLowerCase()}`;
  return prefixes;
};

/** Holds a `animationend` event key value. */
export const ANIMATION_END_CSS: string = Object.keys(
  makePrefixMap('Animation', 'AnimationEnd')
).filter((key) => {
  if (typeof document === 'undefined') return false;
  const html = document.getElementsByTagName('html')[0];
  return key in (html ? html.style : {});
})[0];

/** Holds a `transitionend` event key value. */
export const TRANSITION_END_CSS: string = Object.keys(
  makePrefixMap('Transition', 'TransitionEnd')
).filter((key) => {
  if (typeof document === 'undefined') return false;
  const html = document.getElementsByTagName('html')[0];
  return key in (html ? html.style : {});
})[0];

/** A `animationend` event name. */
export const ANIMATION_END: string =
  makePrefixMap('Animation', 'AnimationEnd')[ANIMATION_END_CSS] ||
  'animationend';

/** A `transitionend` event name. */
export const TRANSITION_END: string =
  makePrefixMap('Transition', 'TransitionEnd')[TRANSITION_END_CSS] ||
  'transitionend';

/** Checks if the environment supports transition events. */
export const supportTransition = (): boolean =>
  !!(ANIMATION_END && TRANSITION_END);

/** Assigns a given event handler to a specified DOM. */
export const addListener = (
  target: Node | typeof window | typeof document,
  event: string,
  handler: (e: React.TouchEvent | TouchEvent | Event) => void,
  options?: boolean | EventListenerOptions
): void => {
  if (target.addEventListener) {
    target.addEventListener(event, handler, options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } else if ((target as any).attachEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (target as any).attachEvent(`on${event}`, handler);
  } else {
    target[`on${event}`] = handler;
  }
};

/** Removes a given event handler from a apecified DOM. */
export const removeListener = (
  target: Node | typeof window | typeof document,
  event: string,
  handler: (e: React.TouchEvent | TouchEvent | Event) => void,
  options?: boolean | EventListenerOptions
): void => {
  if (target.removeEventListener) {
    target.removeEventListener(event, handler, options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } else if ((target as any).attachEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (target as any).detachEvent(`on${event}`, handler);
  } else {
    target[`on${event}`] = null;
  }
};

/** Defines extended mouse events. */
export type MouseTouch = MouseEvent &
  Types.Overwrite<
    TouchEvent,
    {
      changedTouches: TouchList;
      targetTouches: TouchList;
    }
  >;

/** Finds `Touch` from a given `TouchList`. */
export const findTouch = (
  array: TouchList,
  condition: (touch: Touch, index: number, TouchList) => boolean
): Touch => {
  for (let i = 0, length = array.length; i < length; i++)
    if (condition.apply(condition, [array[i], i, array])) return array[i];
  return undefined;
};

/** Returns a `Touch` from a given `MouseTouch` event which satisfies the condition. */
export const getTouch = (
  e: MouseTouch,
  identifier: number
): { clientX: number; clientY: number } =>
  (e.targetTouches &&
    findTouch(e.targetTouches, (t: Touch) => identifier === t.identifier)) ||
  (e.changedTouches &&
    findTouch(e.changedTouches, (t: Touch) => identifier === t.identifier));

/** Returns a `Touch` identifier from a given `MouseTouch` event. */
export const getTouchIdentifier = (e: MouseTouch): number => {
  if (e.targetTouches && e.targetTouches[0])
    return e.targetTouches[0].identifier;
  if (e.changedTouches && e.changedTouches[0])
    return e.changedTouches[0].identifier;
};
