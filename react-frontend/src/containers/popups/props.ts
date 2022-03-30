/**
 * @fileoverview Defines {Popups} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Types from '../../utils/types';
import * as FontAwesome from '@fortawesome/fontawesome-svg-core';

/** A type union of application type properties. */
export const ItemType = {
  SETTING: 'setting',
  GITHUB: 'github',
  GITTER: 'gitter',
  SHARE: 'share',
  INFO: 'info',
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

/** A {Header} component properties. */
export type Header = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    type: ItemType;
    title: string;
  }
>;

/** A {Window} component properties. */
export type Window = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    type: ItemType;
    title?: string;
    onClose?: () => void;
  }
>;

/** A {Controller} component properties. */
export type Controller = React.HTMLAttributes<HTMLDivElement>;

/** A {Pager} component properties. */
export type Pager = React.HTMLAttributes<HTMLDivElement>;

/** A {Description} component properties. */
export type Description = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    children: string;
  }
>;

/** A {Button} component properties. */
export type Button = Types.Overwrite<
  React.HTMLAttributes<HTMLSpanElement>,
  {
    icon: string | React.ReactNode | FontAwesome.IconProp;
    title?: string;
    onClick?: () => void;
  }
>;
