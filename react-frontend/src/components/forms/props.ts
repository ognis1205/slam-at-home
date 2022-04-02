/**
 * @fileoverview Defines {Forms} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import * as Types from '../../utils/types';
import * as FontAwesome from '@fortawesome/fontawesome-svg-core';

/** A {Toggle} component properties. */
export type Toggle = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    id: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    options?: { on: string; off: string };
  }
>;

/** A {Text} component properties. */
export type Text = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    id: string;
    name: string;
    placeholder: string;
    toggleId: string;
    toggleName: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//    toggleClassName?: string;
    icon?: string | React.ReactNode | FontAwesome.IconProp;
    disabled?: boolean;
//    options: { on: string; off: string };
  }
>;
