/**
 * @fileoverview Defines {Draggable} module.
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
import * as DOM from '../../utils/dom';
import * as Position from '../../utils/position';

/** Drag event handlers. */
export type DragEventHandler =
  (event: MouseEvent, drag: Position.Drag) => void | false;

/** A {Context} component properties. */
export interface Context {
  onTouchEnd: (e: MouseEvent) => void,
  onMouseDown: (e: MouseEvent) => void,
  onMouseUp: (e: MouseEvent) => void,
  [key: string]: unknown;
}

/** A type union of a component's children. */
type Children =
  (context: Context, ref: (node: unknown) => void) => React.ReactNode;

/** A {Draggableo} component properties. */
export interface Draggable {
  disabled: boolean;
  allowAnyClick: boolean;
  onStart: DragEventHandler,
  onMove: DragEventHandler,
  onStop: DragEventHandler,
  onMouseDown: (e: MouseEvent) => void,
  grid: [number, number],
  handler: DOM.Identifier,
  canceler: DOM.Identifier,
  children: Children,
}
