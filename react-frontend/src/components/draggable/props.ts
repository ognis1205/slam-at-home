/**
 * @fileoverview Defines {Draggable} module.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as DOM from '../../utils/dom';
import * as Position from '../../utils/position';

/** Drag event handlers. */
export type DragEventHandler = (
  event: MouseEvent,
  drag: Position.Drag
) => void | false;

/** A common properties shared by both {Draggable} and {Wrapper} components. */
interface Common {
  disabled?: boolean;
  allowAnyClick?: boolean;
  onStart?: DragEventHandler;
  onMove?: DragEventHandler;
  onStop?: DragEventHandler;
  onMouseDown?: (e: MouseEvent) => void;
  grid?: [number, number];
}

/** A {Draggable} component properties. */
export interface Draggable extends Common {
  handler?: DOM.Identifier;
  canceler?: DOM.Identifier;
  children?: React.ReactElement;
}

/** A {Wrapper} component properties. */
export interface Wrapper extends Common {
  axis?: Position.Axis;
  scale?: number;
  bounds?: Position.Bounds | string | false;
  position?: Position.Coord;
  positionOffset?: Position.CSSCoord;
  defaultPosition?: Position.Coord;
  children?: React.ReactElement;
}
