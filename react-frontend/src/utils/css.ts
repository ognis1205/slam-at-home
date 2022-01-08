/**
 * @fileoverview Defines CSS helper functions.
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
