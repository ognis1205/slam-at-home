/**
 * @fileoverview Defines {Notification} and {Item} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Types from '../../utils/types';

/** A type union of notification level properties. */
export type Level = 'info' | 'success' | 'warning' | 'error' | 'custom';

/** A {Notify} context. */
export type Notify = {
  key: string;
  level: Level;
  title: string;
  message: string;
  ttl: number;
  iconClassName?: string;
  color?: string;
  showCloseButton: bool;
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onHide: () => void;
};

/** A {Item} component properties. */
export type Item = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    level: Level;
    title: string;
    message: string;
    ttl: number;
    iconClassName?: string;
    color?: string;
    showCloseButton: bool;
    onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
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
