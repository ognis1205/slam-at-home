/**
 * @fileoverview Defines {Modal} context.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';

/** A {Modal} context type. */
export type ContextType = {
  id: string;
  isOpen: boolean;
  openHandler: Props.OpenHandler;
  closeHandler: Props.CloseHandler;
  mouseEnterHandler: Props.MouseHandler;
  mouseLeaveHandler: Props.MouseHandler;
};

/** A {Modal} conetx. */
export const Modal = React.createContext<ContextType | null>(null);
