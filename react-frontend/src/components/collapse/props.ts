/**
 * @fileoverview Defines {Collapse} properties.
 * @copyright Shingo OKAWA 2021
 */
import type * as React from 'react';
import type * as Motion from '../motion';
import type * as Types from '../../utils/types';
import * as FontAwesome from '@fortawesome/react-fontawesome';

/** Defines collapsible types. */
export type CollapsibleType = 'header' | 'disabled';

/** Defines common properties. */
export interface Common {
  className?: string;
  active?: boolean;
}

/** Defines {Panel.Header} properties. */
export interface Header extends Common {
  onClick?: (key: string | number) => void;
  panelKey?: string | number;
  showArrow?: boolean;
  collapsible?: CollapsibleType;
  accordion?: boolean;
  arrow?: (props: Header) => React.ReactNode;
  icon?: string | React.ReactNode | FontAwesome.Props;
  iconClassName?: string;
}

/** Defines {Panel.Content} properties. */
export interface Content extends Common {
  style?: React.CSSProperties;
  role?: string;
  forceRender?: boolean;
}

/** Defines {Panel} properties. */
export type Panel = Types.Overwrite<
  Header & Content,
  {
    id?: string;
    className?: string;
    children?: React.ReactNode;
    header?: string | React.ReactNode;
    headerClassName?: string;
    iconClassName?: string;
    motion?: Motion.Props;
    destroyInactivePanel?: boolean;
  }
>;

/** Defines {Wrapper} properties. */
export type Wrapper = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onChange?: (key: React.Key | React.Key[]) => void;
    motion?: Motion.Props;
    accordion?: boolean;
    activeKey?: React.Key | React.Key[];
    defaultActiveKey?: React.Key | React.Key[];
    destroyInactivePanel?: boolean;
    collapsible?: CollapsibleType;
  }
>;
