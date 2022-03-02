/**
 * @fileoverview Defines {Drawer} and {Content} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Types from '../../utils/types';

/** A type union of notification level properties. */
export type Level = 'info' | 'success' | 'warning' | 'error' | 'custom';

/** A {Notification} component properties. */
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
