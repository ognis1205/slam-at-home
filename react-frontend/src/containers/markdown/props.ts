/**
 * @fileoverview Defines {Markdown} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Types from '../../utils/types';

/** A {Markdown} component properties. */
export type Markdown = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    src: string;
  }
>;
