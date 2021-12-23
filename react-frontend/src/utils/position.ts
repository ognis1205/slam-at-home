/**
 * @fileoverview Defines DOM position helper functions.
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
import * as DOM from './dom';
import * as Event from './event';
import * as Misc from './misc';

/** General purpose 2-D positions. */
export interface Coord {
  x: number;
  y: number;
};

/** General purpose 2-D positions. */
export interface CSSCoord {
  x: number | string;
  y: number | string;
};

/** Offset information handled with `TouchEvent`. */
export interface Offset {
  clientX: number;
  clientY: number;
}

/** Defines HTML bounds. */
export interface Bounds {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
};

/** Defines dragging context. */
export interface Drag {
  target: HTMLElement,
  x: number,
  y: number,
  dx: number,
  dy: number,
  x0: number,
  y0: number,
}

/** A type union of dragging axis. */
export type Axis = 'both' | 'x' | 'y' | 'none';

/** Returns the position of the element relative to the bound. */
export const get = (
  target: HTMLElement,
  bounds: Bounds | string | false,
  x: number,
  y: number,
): Coord => {
  if (!bounds || !Object.keys(bounds).length) 
    return {x: x, y: y};

  bounds = typeof bounds === 'string'
         ? bounds
         : {
           left: bounds.left,
           top: bounds.top,
           right: bounds.right,
           bottom: bounds.bottom
         } as Bounds;

  if (typeof bounds === 'string') {
    const outer = bounds === 'parent'
                ? target.parentNode as HTMLElement
                : target.ownerDocument.querySelector(bounds) as HTMLElement;
    const style = target.ownerDocument.defaultView.getComputedStyle(target);
    const outerStyle = target.ownerDocument.defaultView.getComputedStyle(outer);
    bounds = {
      left: Misc.toInt(outerStyle.paddingLeft)
        + Misc.toInt(style.marginLeft)
        - target.offsetLeft,
      top: Misc.toInt(outerStyle.paddingTop)
        + Misc.toInt(style.marginTop)
        - target.offsetTop,
      right: DOM.getInnerWidth(outer)
        + Misc.toInt(outerStyle.paddingRight)
        - DOM.getOuterWidth(target)
        - target.offsetLeft
        - Misc.toInt(style.marginRight),
      bottom: DOM.getInnerHeight(outer)
        + Misc.toInt(outerStyle.paddingBottom)
        - DOM.getOuterHeight(target)
        - target.offsetTop
        - Misc.toInt(style.marginBottom)
    };
  }

  if (Misc.isNumeric(bounds.right))
    x = Math.min(x, bounds.right);
  if (Misc.isNumeric(bounds.bottom))
    y = Math.min(y, bounds.bottom);
  if (Misc.isNumeric(bounds.left))
    x = Math.max(x, bounds.left);
  if (Misc.isNumeric(bounds.top))
    y = Math.max(y, bounds.top);

  return {x: x, y: y};
};

/** Snaps a given coordinate to a specified grid. */
export const snapTo = (grid: [number, number], pendingX: number, pendingY: number): [number, number] => {
  const x = Math.round(pendingX / grid[0]) * grid[0];
  const y = Math.round(pendingY / grid[1]) * grid[1];
  return [x, y];
};

/** Returns the position of the event relative to the bound. */
export const on = (
  event: Event.MouseTouch,
  target: HTMLElement,
  identifier: number | {
    scale: number,
    offsetParent?: HTMLElement,
  },
): Coord => {
  let position = undefined;
  if (typeof identifier === 'number') {
    position = Event.getTouch(event, identifier);
    if (!position)
      return null;
  } else {
    const offsetParent = (identifier?.offsetParent || target.offsetParent || target.ownerDocument.body) as HTMLElement;
    return offsetFromParent(position || event, offsetParent, identifier?.scale);
  }
};

/** Returns the relative position from offsetParent. */
const offsetFromParent = (event: Offset, offsetParent: HTMLElement, scale?: number): Coord => {
  const rect = offsetParent === offsetParent.ownerDocument.body 
             ? {left: 0, top: 0}
             : offsetParent.getBoundingClientRect();
  return {
    x: (event.clientX + offsetParent.scrollLeft - rect.left) / (scale || 1),
    y: (event.clientY + offsetParent.scrollTop - rect.top) / (scale || 1),
  };
};

/** Returns dragging context. */
export const drag = (
  target: HTMLElement,
  state: { x0: number, y0: number },
  x: number,
  y: number,
): Drag => {
  if (!Misc.isNumeric(state.x0) || !Misc.isNumeric(state.y0))
    return {
      target,
      x, y,
      dx: 0, dy: 0,
      x0: x, y0: y,
    };
  else
    return {
      target,
      x, y,
      dx: x - state.x0, dy: y - state.y0,
      x0: state.x0, y0: state.y0,
    };
};

/** Returns `true` if the axis is x-directional draggable. */
export const canDragX = (axis: Axis): boolean =>
  axis === 'both' || axis === 'x';

/** Returns `true` if the axis is y-directional draggable. */
export const canDragY = (axis: Axis): boolean =>
  axis === 'both' || axis === 'y';
