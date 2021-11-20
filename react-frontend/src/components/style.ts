/**
 * @fileoverview Defines CSS style helper functions.
 */
import * as React from 'react';

/**
 * Sets element style, return previous style
 * @param {React.CSSProperties} style The CSS style object to be set.
 * @param {HTMLElement} element The HTML element where a given style is set.
 */
export const set = (
  style: React.CSSProperties,
  element: HTMLElement = document.body
): React.CSSProperties => {
  if (!style)
    return {} as React.CSSProperties;

  const old: React.CSSProperties = {};
  const keys = Object.keys(style);

  keys.forEach(key => { old[key] = element.style[key]; });
  keys.forEach(key => { element.style[key] = style[key]; });

  return old;
};
