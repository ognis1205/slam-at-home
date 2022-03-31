/**
 * @fileoverview Defines {Panel} properties.
 * @copyright Shingo OKAWA 2022
 */
import * as Draggable from '../../components/draggable';
import type * as Types from '../../utils/types';
import * as FontAwesome from '@fortawesome/fontawesome-svg-core';

/** A {Left} component properties. */
export type Left = React.HTMLAttributes<HTMLDivElement>;

/** A {Right} component properties. */
export type Right = React.HTMLAttributes<HTMLDivElement>;

/** A {Panel} component properties. */
export type Panel = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  Draggable.Props & {
    width: number;
    leftmost: number;
    rightmost: number;
    onOpen?: () => void;
  }
>;

/** A {Window} component properties. */
export type Window = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    isMaximized: boolean;
    isMenuOpened: boolean;
    onMaximize?: () => void;
    onMenuOpen?: () => void;
  }
>;

/** A {Controller} component properties. */
export type Controller = React.HTMLAttributes<HTMLDivElement>;

/** A {Pager} component properties. */
export type Pager = React.HTMLAttributes<HTMLDivElement>;

/** A {Button} component properties. */
export type Button = Types.Overwrite<
  React.HTMLAttributes<HTMLSpanElement>,
  {
    icon: string | React.ReactNode | FontAwesome.IconProp;
    title?: string;
    onClick?: () => void;
  }
>;
