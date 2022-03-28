/**
 * @fileoverview Defines {Navigation} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import { LinkProps } from 'next/link';
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
  CAMERA: 'camera',
  CONSTRUCTION: 'construction',
  DOCUMENT: 'document',
  GITHUB: 'github',
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

/** A {Router} component properties. */
export type Router = Types.Overwrite<
  LinkProps,
  {
    key: string | number;
    type: ItemType;
    title: string;
  }
>;

/** A {Github} component properties. */
export type Github = Types.Overwrite<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  {
    dataShowCount: boolean | string;
    ariaLabel: string;
  }
>;

/** A {Coffee} component properties. */
export type Coffee = React.AnchorHTMLAttributes<HTMLAnchorElement>;
