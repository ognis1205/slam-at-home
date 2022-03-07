/**
 * @fileoverview Defines {Notification} and {Item} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Types from '../../utils/types';

/** A type union of notification level properties. */
export const Level = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  CUSTOM: 'custom',
} as const;

export type Level = typeof Level[keyof typeof Level];

/** A {Notify} context. */
export type Notify = {
  key: string;
  level: Level;
  title: string;
  message: string;
  ttl: number;
  icon?: string | React.ReactNode;
  color?: string;
  showCloseButton?: boolean;
  onClick?: () => void;
  onHide?: () => void;
};

/** Notified event. */
export const NotifiedEvent = 'notified' as const;

/** A {Item} component properties. */
export type Item = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    level: Level;
    title: string;
    message: string;
    ttl: number;
    icon?: string | React.ReactNode;
    color?: string;
    showCloseButton: boolean;
    onClick: () => void;
    onHide: () => void;
  }
>;

/** A {Items} component properties. */
export type Items = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    notifies: Notify[];
    onHide: (notify: Notify) => void;
    duration: number;
  }
>;

/** A {Notification} component properties. */
export type Notification = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    duration: number;
  }
>;
