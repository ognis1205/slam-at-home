/**
 * @fileoverview Defines {Modal} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import * as Types from '../../utils/types';

/** A {Toggle} component properties. */
export type Toggle = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    id: string;
    name: string;
    checked: boolean;
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    options: { on: string; off: string };
  }
>;
