/**
 * @fileoverview Defines {Notification} and {Item} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Motion from '../../components/motion';
import type * as Reducks from '../../redux/modules/notification';
import type * as Types from '../../utils/types';
import * as FontAwesome from '@fortawesome/fontawesome-svg-core';

/** A type union of CSS position properties. */
export type Placement = 'left' | 'right';

/** A type union of notification level properties. */
export const Level = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  CUSTOM: 'custom',
} as const;

export type Level = typeof Level[keyof typeof Level];

/** A {Item} component properties. */
export type Item = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    level: Level;
    title: string;
    message: string;
    ttl: number;
    icon?: string | React.ReactNode | FontAwesome.IconProp;
    showCloseButton: boolean;
    onClick: () => void;
    onHide: () => void;
    style?: React.CSSProperties;
  }
>;

/** A {Item} component properties. */
export type NotificationWithStyle = Types.Overwrite<
  Reducks.Item,
  {
    className: string;
    style: string;
  }
>;

/** A {Items} component properties. */
export type Items = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    notifies: Reducks.Item[];
    onHide: (notify: Reducks.Item) => void;
    duration: number;
    placement: Placement;
    motion?: Motion.Props;
  }
>;

/** A {Notification} component properties. */
export type Notification = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    duration: number;
    placement: Placement;
    motion?: Motion.Props;
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
