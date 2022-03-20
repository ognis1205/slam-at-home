/**
 * @fileoverview Defines {Menu} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Drawer from '../../components/drawer';
import type * as Types from '../../utils/types';
import * as FontAwesome from '@fortawesome/react-fontawesome';

/** A {Menu} component properties. */
export type Menu = Drawer.Props;

/** A {Header} component properties. */
export type Header = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    [key: string]: unknown;
  }
>;

/** An {Item} context. */
export type ItemType = {
  title: string;
  icon?: string | React.ReactNode | FontAwesome.Props;
  onClick?: () => void;
};

/** A {Item} component properties. */
export type Item = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  ItemType
>;

/** A {Section} component properties. */
export type Section = {
  header: string;
  key: number | string;
  items: ItemType[];
};
