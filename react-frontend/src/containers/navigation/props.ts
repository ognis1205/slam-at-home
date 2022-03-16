/**
 * @fileoverview Defines {Navigation} and {Item} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Types from '../../utils/types';

/** A {Header} component properties. */
export type Header = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    [key: string]: unknown;
  }
>;

/** A {Github} component properties. */
export type Github = React.HTMLAttributes<HTMLAElement>;

/** A {Coffee} component properties. */
export type Coffee = React.HTMLAttributes<HTMLAElement>;
