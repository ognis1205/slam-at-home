/**
 * @fileoverview Defines {Menu} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Types from '../../utils/types';

/** A {Menu} component properties. */
export type Menu = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    //
  }
>;
