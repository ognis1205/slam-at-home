/**
 * @fileoverview Defines {Modal} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import * as Portal from '../../components/portal';
import * as Popup from '../../utils/popup';
import * as Types from '../../utils/types';

/** A type union of modal events. */
export type Event = 'hover' | 'click' | 'focus' | 'right-click';

/** A type union of modal position properties. */
export type Position = Popup.Position;

/** A popup action trigger. */
export type Trigger = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

/** A type of open event handler. */
export type MouseHandler = (e?: React.SyntheticEvent) => void;

/** A type of open event handler. */
export type OpenHandler = (e?: React.SyntheticEvent) => void;

/** A type of close event handler. */
export type CloseHandler = (
  e?: React.SyntheticEvent | KeyboardEvent | TouchEvent | MouseEvent
) => void;

/** A common properties shared by both {Modal} and {Content} components. */
type Common = {
  children:
    | React.ReactNode
    | ((onClose: CloseHandler, isOpen: boolean) => React.ReactNode);
  container?: DOM.Identifier;
  modal?: boolean;
  trigger?: JSX.Element | ((isOpen: boolean) => JSX.Element);
  on?: Event | Event[];
};

/** A {Content} component properties. */
export type Content = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  Common & Portal.Context
>;

//export interface WrapperContext {
//  container?: DOM.Identifier;
//  getOpenCount?: () => number;
//  scrollLocker?: Scroll.Locker;
//  switchScrollingEffect?: () => void;
//}

/** A {Modal} component properties. */
export type Modal = Types.Overwrite<
  Common,
  {
    offset: { x: number; y: number };
    disabled?: boolean;
    open?: boolean;
    defaultOpen?: boolean;
    onOpen?: OpenHandler;
    onClose?: CloseHandler;
    position?: Position | Position[];
    delay?: number;
    closeOnDocumentClick?: boolean;
    closeOnEscape?: boolean;
    repositionOnResize?: boolean;
    overlayStyle?: React.CSSProperties;
    keepTooltipInside?: boolean | string;
  }
>;
