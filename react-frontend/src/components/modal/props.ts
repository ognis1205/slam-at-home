/**
 * @fileoverview Defines {Modal} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import * as Popup from '../../utils/popup';
import * as Types from '../../utils/types';

/** A type union of modal events. */
export type Event = 'hover' | 'click' | 'focus' | 'right-click';

/** A type union of modal position properties. */
export type Position = Popup.Position;

/** A common properties shared by both {Modal} and {Content} components. */
type Common = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    open?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    modal?: boolean;
    trigger?: JSX.Element | ((isOpen: boolean) => JSX.Element);
    delay?: number;
    on?: Event | Event[];
    onOpen?: (event?: React.SyntheticEvent) => void;
    onClose?: (
      event?: React.SyntheticEvent | KeyboardEvent | TouchEvent | MouseEvent
    ) => void;
  }
>;

/** A {Content} component properties. */
export type Content = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  Common
>;

/** A {Modal} component properties. */
export type Modal = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
//    children: React.ReactNode;
//    className?: string;
    offset: { x: number; y: number };
////    trigger?: JSX.Element | ((isOpen: boolean) => JSX.Element);
////    open?: boolean;
////    defaultOpen?: boolean;
////    disabled?: boolean;
    nested?: boolean;
////    on?: Event | Event[];
    //| ((close: () => void, isOpen: boolean) => React.ReactNode);
    position?: Position | Position[];
//    offsetX?: number;
//    offsetY?: number;
    arrow?: boolean;
////    modal?: boolean;
    lockScroll?: boolean;
    closeOnDocumentClick?: boolean;
    closeOnEscape?: boolean;
    repositionOnResize?: boolean;
////    mouseEnterDelay?: number;
////    mouseLeaveDelay?: number;
////    onOpen?: (event?: React.SyntheticEvent) => void;
    // the popup can be closed depend on multiple factor: mouse click outside, keyboard esc, click a close button
////    onClose?: (
////      event?: React.SyntheticEvent | KeyboardEvent | TouchEvent | MouseEvent
////    ) => void;
//    contentStyle?: React.CSSProperties;
    overlayStyle?: React.CSSProperties;
    arrowStyle?: React.CSSProperties;
    keepTooltipInside?: boolean | string;
  }
>;
