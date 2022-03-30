/**
 * @fileoverview Defines {Menu} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Modal from '../../components/modal';
import type * as Types from '../../utils/types';

/***/
export type Trigger = Modal.Trigger;

/** A type union of application type properties. */
export const ItemType = {
  SETTING: 'setting',
  GITHUB: 'github',
  GITTER: 'gitter',
  SHARE: 'share',
  INFO: 'info',
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

/** A {Externallink} component properties. */
export type ExternalLink = Types.Overwrite<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  {
    key: string | number;
    type: ItemType;
    title: string;
  }
>;

/** A {Popup} component properties. */
export type Popup = Types.Overwrite<
  React.AnchorHTMLAttributes<HTMLDivElement>,
  {
    key: string | number;
    type: ItemType;
    title: string;
  }
>;

/** A {Menu} component properties. */
export type Menu = React.HTMLAttributes<HTMLDivElement>;
