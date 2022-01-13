/**
 * @fileoverview Defines {Drawer} and {Content} properties.
 * @copyright Shingo OKAWA 2021
 */
import type * as React from 'react';
import * as Portal from '../portal';
import * as DOM from '../../utils/dom';
import type * as Types from '../../utils/types';

/** A type union of CSS position properties. */
export type Placement = 'left' | 'top' | 'right' | 'bottom';

/** A type union of draw width definitions. */
export type DrawWidth = number | [number, number];

/** A common properties shared by both {Drawer} and {Content} components. */
type Common = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    width?: string | number;
    height?: string | number;
    open?: boolean;
    handler?: React.ReactElement | null | false;
    placement?: Placement;
    drawPane?: null | string | string[];
    drawWidth?:
      | DrawWidth
      | ((e: { target: HTMLElement; open: boolean }) => DrawWidth);
    drawDuration?: string;
    drawEase?: string;
    showMask?: boolean;
    maskClosable?: boolean;
    maskStyle?: React.CSSProperties;
    onChange?: (open?: boolean) => void;
    afterVisibleChange?: (open: boolean) => void;
    onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
    onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
    keyboard?: boolean;
    wrapperStyle?: React.CSSProperties;
    autoFocus?: boolean;
  }
>;

/** A {Content} component properties. */
export type Content = Types.Overwrite<
  Common,
  Portal.Context & {
    visible?: boolean;
    afterClose?: () => void;
  }
>;

/** A {Drawer} component properties. */
export type Drawer = Types.Overwrite<
  Common,
  {
    className?: string;
    container?: DOM.Identifier;
    forceRender?: boolean;
    defaultOpen?: boolean;
  }
>;
