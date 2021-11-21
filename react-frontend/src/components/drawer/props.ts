/**
 * @fileoverview Defines {Wrapper} and {Item} properties.
 */
import type * as React from 'react';
import * as Misc from '../../utils/misc';
import * as Scroll from '../../utils/scroll';
import classnames from 'classnames';

/** A type union of HTML container getters. */
type Container = string | HTMLElement | (() => HTMLElement);

/** A type union of CSS position properties. */
type Placement = 'left' | 'top' | 'right' | 'bottom';

/** A type union of draw width definitions. */
type DrawWidth = number | [number, number];

/** A common properties shared by both {Wrapper} and {Item} components. */
interface Common extends Omit<React.HTMLAttributes<unknown>, 'onChange'> {
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
  container?: Container;
}

/** A {Wrapper} component properties. */
export interface Wrapper extends Common {
  wrapperClass?: string;
  forceRender?: boolean;
}

/** A {Item} component properties. */
export interface Item extends Common {
  getOpenCount?: () => number;
  scrollLocker?: Scroll.Locker;
  switchScrollingEffect?: () => void;
}

/** Returns the container element of a drawer item. */
export const getContainer = ({container}: Common): HTMLElement => {
  if (container instanceof HTMLElement) {
    return container;
  } else if (typeof container === 'string') {
    return document.getElementById(container);
  } else {
    return container();
  }
};

/** Returns the class name of the wrapper. */
export const getWrapperClass = (
  {prefixClass, placement, className, showMask}: Common,
  open: boolean
): string => {
  return classnames(prefixClass, {
    [`${prefixClass}-${placement}`]: true,
    [`${prefixClass}-open`]: open,
    [className || '']: !!className,
    'no-mask': !showMask,
  });
};

/** Returns the `transform` CSS property. */
export const getTransform = ({open, placement}: Common): string => {
  const position = placement === 'left' || placement === 'top' ? '-100%' : '100%';
  return open ? '' : `${placement}(${position})`;
};

/** Rerturns the width of the component. */
export const getWidth = ({width}: Common): string => {
  return Misc.isNumeric(width) ? `${width}px` : width as string;
};

/** Rerturns the height of the component. */
export const getHeight = ({height}: Common): string => {
  return Misc.isNumeric(height) ? `${height}px` : height as string;
};

/** Returns a draw width. */
export const getDrawWidth = (
  {open, drawWidth}: Common,
  target: HTMLElement,
  size: string | number
): string | number => {
  let ret = open ? size : 0;
  if (drawWidth) {
    const width = (() => {
      const w =
        typeof drawWidth === 'function'
        ? drawWidth({target: target, open: open})
        : drawWidth;
      return Array.isArray(w)
           ? (w.length === 2 ? w : [w[0], w[1]])
           : [w];
    })();
    ret = open
        ? width[0]
        : width[1] || 0;
  }
  return ret;
};

/** Checks if a given handler is `ReactElement.` */
export const isReactElement = (
  handler: React.ReactElement | null | false
): handler is React.ReactElement => {
  return handler !== false && handler !== null;
};
