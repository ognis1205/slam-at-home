/**
 * @fileoverview Defines {Players} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import * as Types from '../../utils/types';

/** A {Video} component properties. */
export type Video = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    isReady: boolean;
  }
>;

/** A {Scene} component properties. */
export type Projector = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    width: number;
    height: number;
  }
>;
