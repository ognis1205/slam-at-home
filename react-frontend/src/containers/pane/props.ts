/**
 * @fileoverview Defines {Left}, {Right} and {Divider} properties.
 * @copyright Shingo OKAWA 2021
 */
import * as Draggable from '../../components/draggable';

/** A {Left} component properties. */
export interface Left {
  [key: string]: unknown;
}

/** A {Right} component properties. */
export interface Right {
  [key: string]: unknown;
}

/** A {Divider} component properties. */
export interface Divider extends Draggable.Props {
  leftmost: number;
  rightmost: number;
}
