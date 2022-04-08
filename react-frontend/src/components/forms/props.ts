/**
 * @fileoverview Defines {Forms} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import * as Types from '../../utils/types';
import * as FontAwesome from '@fortawesome/fontawesome-svg-core';
import * as FontAwesomeCore from '@fortawesome/fontawesome-svg-core';

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
    onCheck: (value: string) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    icon?: string | React.ReactNode | FontAwesome.IconProp;
    textDisabled?: boolean;
    checkDisabled?: boolean;
  }
>;

export type Option = {
  value: string;
  icon: FontAwesomeCore.IconDefinition;
  name: string;
};

/** A {Select} component properties. */
export type Select = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    id: string;
    onCheck?: (value: string) => void;
    options?: Option[];
  }
>;
