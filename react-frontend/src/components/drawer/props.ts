/**
 * @fileoverview Defines {Wrapper} and {Item} properties.
 */
import type * as React from 'react';

/** A type union of HTML container getters. */
type Container = string | HTMLElement | (() => HTMLElement);

/** A type union of CSS position properties. */
type Placement = 'left' | 'top' | 'right' | 'bottom';

/** A type union of draw width definitions. */
type DrawWidth = number | [number, number];

/** A common properties shared by both {Wrapper} and {Item} components. */
interface CommonProps extends Omit<React.HTMLAttributes<unknown>, 'onChange'> {
  prefixClass?: string;
  width?: string | number;
  height?: string | number;
  open?: boolean;
  defaultOpen?: boolean;
  handler?: React.ReactElement | null | false;
  placement?: Placement;
  drawLevel?: null | string | string[];
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
  onHandleClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  keyboard?: boolean;
  contentWrapperStyle?: React.CSSProperties;
  autoFocus?: boolean;
}

/** A {Wrapper} component properties. */
export interface WrapperProps extends CommonProps {
  container?: Container;
  wrapperClass?: string;
  forceRender?: boolean;
}

/** A {Item} component properties. */
export interface ItemProps extends CommonProps {
  container?: Container;
  getOpenCount?: () => number;
  switchScrollingEffect?: () => void;
}
