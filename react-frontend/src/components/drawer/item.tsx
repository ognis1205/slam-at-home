/**
 * @fileoverview Defines {Item} component.
 */
import * as React from 'react';
import * as Utils from './utils';
import { ItemProps } from './props';

export const Item: React.FunctionComponent<ItemProps> = (props: ItemProps): React.ReactElement => {
  /** A Multi-level drawer contents. */
  const [levels, setLevelsState] = React.useState<HTMLElement[]>([]);

  /** A current drawer flags. */
  const [currentDrawer] = React.useState<Record<string, boolean>>({});

  /** A drawer content. */
  const [content, setContentState] = React.useState<HTMLElement | null>(null);


  /** Sets drawer level HTML elements. */
  const setLevels = (): void => {
    let {drawLevel, container} = props;

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

  /** Opens a level with transition. */
  const openLevelTransition = (): void => {
    let {open, width, height, onChange} = props;

    const {isHorizontal, translateFunction} = translationContext;
    const rect = content ? content.getBoundingClientRect()[isHorizontal ? 'width' : 'height'] : 0;
    const size = (isHorizontal ? width : height) || rect;

    if (!Utils.windowIsUndefined) {
      const right =
        document.body.scrollHeight >
          (window.innerHeight || document.documentElement.clientHeight) &&
        window.innerWidth > document.body.offsetWidth
          ? Utils.getScrollBarSize(true)
          : 0;
//      setLevelTransform(open, translateFunction, size, right);
//      toggleScrollingToDrawerAndBody(right);
    }
    if (onChange) onChange(open);
  };

  /** Checks if `placement` is horizontal or not. */
  const translationContext = ((): { isHorizontal: boolean; translateFunction: string; } => {
    let {placement} = props;
    const isHorizontal = placement === 'left' || placement === 'right';
    const translateFunction = `translate${isHorizontal ? 'X' : 'Y'}`;
    return {
      isHorizontal,
      translateFunction
    };
  })();

  /** Checks if some drawer is opened. */
  const isSomeDrawerOpened = (): boolean =>
    !Object.keys(currentDrawer).some(key => currentDrawer[key]);

  return (
    <></>
  );
};
