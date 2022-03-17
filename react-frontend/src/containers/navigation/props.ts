/**
 * @fileoverview Defines {Navigation} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Types from '../../utils/types';

/** A {Navigation} component properties. */
export type Navigation = React.HTMLAttributes<HTMLDivElement>;

/** A {Header} component properties. */
export type Header = React.HTMLAttributes<HTMLDivElement>;

/** A {Footer} component properties. */
export type Footer = React.HTMLAttributes<HTMLDivElement>;

/** A {TreeView} component properties. */
export type TreeView = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    [key: string]: unknown;
  }
>;

/** A type union of application type properties. */
export const ItemType = {
  APPLICATION: 'application',
  DOCUMENT: 'document',
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

/** A {Item} component properties. */
export type Item = Types.Overwrite<
  React.HTMLAttributes<HTMLAElement>,
  {
    key: string | number;
    type: ItemType;
    title: string;
    active: boolean;
  }
>;

/** A {Github} component properties. */
export type Github = React.HTMLAttributes<HTMLAElement>;

/** A {Coffee} component properties. */
export type Coffee = React.HTMLAttributes<HTMLAElement>;
