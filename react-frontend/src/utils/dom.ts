/**
 * @fileoverview Defines DOM helper classes/functions.
 */
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
