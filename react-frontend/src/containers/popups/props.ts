/**
 * @fileoverview Defines {Panel} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as Types from '../../utils/types';
import * as FontAwesome from '@fortawesome/fontawesome-svg-core';

/** A {Window} component properties. */
export type Window = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    icon?: string | React.ReactNode | FontAwesome.IconProp;
    title?: string;
    onClose?: () => void;
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
