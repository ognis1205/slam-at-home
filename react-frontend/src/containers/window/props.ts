/**
 * @fileoverview Defines {Window} properties.
 * @copyright Shingo OKAWA 2021
 */
import type * as Types from '../../utils/types';

/** A {Window} component properties. */
export type Window = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    [key: string]: unknown;
  }
>;
