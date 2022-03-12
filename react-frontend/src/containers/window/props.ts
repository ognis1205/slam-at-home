/**
 * @fileoverview Defines {Window} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as Types from '../../utils/types';

/** A {Window} component properties. */
export type Window = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    [key: string]: unknown;
  }
>;

/** A {Controller} component properties. */
export type Controller = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    buttons: Button[];
  }
>;

/** A {Button} component properties. */
export type Button = Types.Overwrite<
  React.HTMLAttributes<HTMLSpanElement>,
  {
    icon: string | React.ReactNode | FontAwesome.Props;
    title?: string;
    onClick?: () => void;
  }
>;
