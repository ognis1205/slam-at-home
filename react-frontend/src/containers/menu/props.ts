/**
 * @fileoverview Defines {Header} and {Menu} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as Types from '../../utils/types';

/** A {Header} component properties. */
export type Header = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    [key: string]: unknown;
  }
>;
