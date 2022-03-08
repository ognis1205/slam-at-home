/**
 * @fileoverview Defines {Left}, {Right} and {Divider} properties.
 * @copyright Shingo OKAWA 2021
 */
import * as Draggable from '../../components/draggable';
import type * as Types from '../../utils/types';

/** A {Left} component properties. */
export type Left = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    [key: string]: unknown;
  }
>;

/** A {Right} component properties. */
export type Right = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    [key: string]: unknown;
  }
>;

/** A {Divider} component properties. */
export interface Divider extends Draggable.Props {
  leftmost: number;
  rightmost: number;
}
