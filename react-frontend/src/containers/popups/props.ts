/**
 * @fileoverview Defines {Popups} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as Types from '../../utils/types';
import type * as WebSocketUtil from '../../utils/websocket';
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

/** Represents RTC status. */
export type RTCStatus = {
  localId: string;
  remoteId: string;
  hasLocalSDP: boolean;
  hasRemoteSDP: boolean;
  localCandidate: number;
  remoteCandidate: number;
};

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

/** A {Button} component properties. */
export type Button = Types.Overwrite<
  React.HTMLAttributes<HTMLSpanElement>,
  {
    icon: string | React.ReactNode | FontAwesome.IconProp;
    title?: string;
    onClick?: () => void;
  }
>;

/** A {About} component properties. */
export type About = Types.Overwrite<
  Omit<Window, 'type'>,
  {
    onClose?: () => void;
  }
>;

/** A {Share} component properties. */
export type Share = Types.Overwrite<
  Omit<Window, 'type'>,
  {
    onClose?: () => void;
  }
>;

/** A {Settings} component properties. */
export type Settings = Types.Overwrite<
  Omit<Window, 'type'>,
  {
    checked: boolean;
    status: RTCStatus;
    devices?: WebSocketUtil.ClientDescription[];
    url?: string;
    onClose?: () => void;
  }
>;
