/**
 * @fileoverview Defines {Item} component.
 */
import * as React from 'react';
import * as Utils from './utils';
import { ItemProps } from './props';

export const Item: React.FunctionComponent<ItemProps> = (props: ItemProps): React.ReactElement => {
  /** A Multi-level drawer contents. */
  const [levels, setLevelsState] = React.useState<HTMLElement[]>([]);

//  private dom: HTMLElement;
//
//  private contentWrapper: HTMLElement;
//
//  private contentDom: HTMLElement | null;
//
//  private maskDom: HTMLElement;
//
//  private handlerDom: HTMLElement;
//
//  private drawerId: string;
//
//  private timeout: any;
//
//  private passive: { passive: boolean } | boolean;
//
//  private startPos: {
//    x: number;
//    y: number;
//  };
//

  /** Sets drawer level HTML elements. */
  const setLevels = ({drawLevel, container}: ItemProps): void => {
    if (Utils.windowIsUndefined) return;

    container = (() => {
      if (container instanceof HTMLElement) {
        return container;
      } else if (typeof container === 'string') {
        return document.getElementById(container);
      } else {
        return container();
      }
    })();

    const parent = container ? (container.parentNode as HTMLElement) : null;

    setLevelsState([] as HTMLElement[]);

    if (drawLevel === 'all') {
      const children: HTMLElement[] = parent ? Array.prototype.slice.call(parent.children) : [];
      children.forEach((child: HTMLElement) => {
        if (child.nodeName !== 'SCRIPT' &&
            child.nodeName !== 'STYLE' &&
            child.nodeName !== 'LINK' &&
            child !== container
        ) levels.push(child);
      });
    } else if (drawLevel) {
      Utils.toArray(drawLevel).forEach(key => {
        document.querySelectorAll(key).forEach(item => levels.push(item));
      });
    }
  };

  /** Checks if `placement` is horizontal or not. */
  const isHorizontal = ({placement}: ItemProps): { isHorizontal: boolean; translate: string; } => {
    const isHorizontal = placement === 'left' || placement === 'right';
    const translate = `translate${isHorizontal ? 'X' : 'Y'}`;
    return { isHorizontal, translate };
  };

  return (
    <></>
  );
};
