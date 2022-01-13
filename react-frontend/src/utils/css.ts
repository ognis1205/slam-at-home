/**
 * @fileoverview Defines CSS helper functions.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';

/** Sets element style, return previous style. */
export const set = (
  style: React.CSSProperties,
  element: HTMLElement = document.body
): React.CSSProperties => {
  if (!style) return {} as React.CSSProperties;
  const old: React.CSSProperties = {};
  const keys = Object.keys(style);
  keys.forEach((key) => {
    old[key] = element.style[key];
  });
  keys.forEach((key) => {
    element.style[key] = style[key];
  });
  return old;
};
