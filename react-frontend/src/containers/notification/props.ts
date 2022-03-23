/**
 * @fileoverview Defines {Notification} and {Item} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Motion from '../../components/motion';
import type * as Notifications from '../../redux/modules/notifications';
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

/** A {Items} component properties. */
export type Items = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    notifies: Notifications.Item[];
    onHide: (notify: Notifications.Item) => void;
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
