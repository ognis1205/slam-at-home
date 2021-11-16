/**
 * @fileoverview Defines {Item} component.
 */
import * as React from 'react';
import * as Utils from './utils';
import classnames from 'classnames';
import { ItemProps } from './props';

export const Item: React.FunctionComponent<ItemProps> = (props: ItemProps): React.ReactElement => {
  /** A Multi-level drawer contents. */
  const [levels, setLevelsState] = React.useState<HTMLElement[]>([]);

  /** A current drawer flags. */
  const [currentDrawer] = React.useState<Record<string, boolean>>({});

  /** A passive mode support flag. */
  const [passive, setPassiveState] = React.useState<{ passive: boolean } | boolean>(false);

  /** A timeout duration. */
  const [timeout, setTimeoutState] = React.useState<any>(null);

  /** A reference to the component. */
  const self = React.useRef<HTMLDivElement>(null);

  /** A reference to the mask. */
  const mask = React.useRef<HTMLDivElement>(null);

  /** A reference to the wrapper. */
  const wrapper = React.useRef<HTMLDivElement>(null);

  /** A drawer content. */
  const content = React.useRef<HTMLDivElement>(null);

  /** A draw handler. */
  const button = React.useRef<HTMLElement>(null);

//  private drawerId: string;
//
//  private startPos: {
//    x: number;
//    y: number;
//  };
//

  /** Sets drawer level HTML elements. */
  const setLevels = (props: ItemProps): void => {
    if (Utils.windowIsUndefined) return;

    const container = getContainer(props);
    const parent = container ? (container.parentNode as HTMLElement) : null;
    setLevelsState([] as HTMLElement[]);

    if (props.drawLevel === 'all') {
      const children: HTMLElement[] = parent ? Array.prototype.slice.call(parent.children) : [];
      children.forEach((child: HTMLElement) => {
        if (child.nodeName !== 'SCRIPT' &&
            child.nodeName !== 'STYLE' &&
            child.nodeName !== 'LINK' &&
            child !== container
        ) levels.push(child);
      });
    } else if (props.drawLevel) {
      Utils.toArray(props.drawLevel).forEach(key => {
        document.querySelectorAll(key).forEach(item => levels.push(item));
      });
    }
  };

  /** Returns the container element of a drawer item. */
  const getContainer = (props: ItemProps): HTMLElement => {
    if (props.container instanceof HTMLElement) {
      return props.container;
    } else if (typeof props.container === 'string') {
      return document.getElementById(props.container);
    } else {
      return props.container();
    }
  };

  /** Opens a level with transition. */
  const openLevelTransition = (props: ItemProps): void => {
    const isHorizontal = props.placement === 'left' || props.placement === 'right';
    const translateFunction = `translate${isHorizontal ? 'X' : 'Y'}`;
    const rect = content.current ? content.current.getBoundingClientRect()[isHorizontal ? 'width' : 'height'] : 0;
    const size = (isHorizontal ? props.width : props.height) || rect;

    if (!Utils.windowIsUndefined) {
      const right =
        document.body.scrollHeight >
          (window.innerHeight || document.documentElement.clientHeight) &&
        window.innerWidth > document.body.offsetWidth
          ? Utils.getScrollBarSize(true)
          : 0;
      setLevelTransform(props, translateFunction, size, right);
      toggleScrolling(props, right);
    }
    if (props.onChange) props.onChange(props.open);
  };

  /** Sets a transform CSS function on assigned levels. */
  const setLevelTransform = (
    props: ItemProps,
    translateFunction?: string,
    size?: string | number,
    right?: number,
  ): void => {
    levels.forEach(level => {
      level.style.transition = `transform ${props.drawDuration} ${props.drawEase}`;
      Utils.addEventListener(level, Utils.TRANSITION_END, onTransitionEnd);
      const width = getDrawWidth(props, level, size);
      const pixel = typeof width === 'number' ? `${width}px` : width;
      let position = 
        props.placement === 'left' || props.placement === 'top'
        ? pixel
        : `-${pixel}`;
      position = 
        props.showMask && props.placement === 'right' && right
        ? `calc(${position} + ${right}px)`
        : position;
      level.style.transform =
        width
        ? `${translateFunction}(${position})`
        : '';
    });
  };

  /** Returns a draw width. */
  const getDrawWidth = (
    props: ItemProps,
    target: HTMLElement,
    size: string | number
  ): string | number => {
    let ret = props.open ? size : 0;
    if (props.drawWidth) {
      const width = (() => {
        const w =
          typeof props.drawWidth === 'function'
          ? props.drawWidth({target: target, open: props.open})
          : props.drawWidth;
        return Array.isArray(w)
             ? (w.length === 2 ? w : [w[0], w[1]])
             : [w];
      })();
      ret = props.open
          ? width[0]
          : width[1] || 0;
    }
    return ret;
  };

  /** An event handler called on `transitionend` events. */
  const onTransitionEnd = (e: TransitionEvent): void => {
    const target: HTMLElement = e.target as HTMLElement;
    Utils.removeEventListener(target, Utils.TRANSITION_END, onTransitionEnd);
    target.style.transition = '';
  };

  /** An event handler called on 'keyboardevent' events. */
  const onKeyDown = (e: React.KeyboardEvent): void => {
    const { onClose } = props;
    if (e.key === 'Escape') {
      e.stopPropagation();
      if (onClose) onClose(e as any);
    }
  };

  /** An event handler called on 'transitionend' events of the wrapper. */
  const onWrapperTransitionEnd = (e: React.TransitionEvent): void => {
    const { open, afterVisibleChange } = props;
    if (e.target === wrapper.current && e.propertyName.match(/transform$/)) {
      if (self.current)
        self.current.style.transition = '';
      if (!open && isSomeDrawerOpened()) {
        document.body.style.overflowX = '';
        if (mask.current) {
          mask.current.style.left = '';
          mask.current.style.width = '';
        }
      }
      if (afterVisibleChange)
        afterVisibleChange(!!open);
    }
  };

  /** Toggles scrolling effects. */
  const toggleScrolling = (
    props: ItemProps,
    right: number
  ): void => {
    const container = getContainer(props);

    if (container && container.parentNode === document.body && props.showMask) {
      const events = ['touchstart'];
      const doms = [document.body, mask.current, button.current, content.current];

      if (props.open && document.body.style.overflow !== 'hidden') {
        if (right) addScrollingEffect(props, right);
        document.body.style.touchAction = 'none';
        doms.forEach((item, i) => {
          if (!item) return;
          Utils.addEventListener(
            item,
            events[i] || 'touchmove',
            i ? removeMoveHandler : removeStartHandler,
            passive,
          );
        });
      } else if (isSomeDrawerOpened()) {
        document.body.style.touchAction = '';
        if (right) remScrollingEffect(right);
        doms.forEach((item, i) => {
          if (!item) return;
          Utils.removeEventListener(
            item,
            events[i] || 'touchmove',
            i ? removeMoveHandler : removeStartHandler,
            passive,
          );
        });
      }
    }
  };

  /** Adds scrolling effects. */
  const addScrollingEffect = (props: ItemProps, right: number): void => {
    const widthTransition = `width ${props.drawDuration} ${props.drawEase}`;
    const transformTransition = `transform ${props.drawDuration} ${props.drawEase}`;
    
    self.current.style.transition = 'none';
    switch (props.placement) {
      case 'right':
        self.current.style.transform = `translateX(-${right}px)`;
        break;
      case 'top':
      case 'bottom':
        self.current.style.width = `calc(100% - ${right}px)`;
        self.current.style.transform = 'translateZ(0)';
        break;
      default:
        break;
    }

    clearTimeout(timeout);
    setTimeoutState(setTimeout(() => {
      if (self.current) {
        self.current.style.transition = `${transformTransition},${widthTransition}`;
        self.current.style.width = '';
        self.current.style.transform = '';
      }
    }));
  };

  /** Checks if some drawer is opened. */
  const isSomeDrawerOpened = (): boolean =>
    !Object.keys(currentDrawer).some(key => currentDrawer[key]);

  /** Checks if the drawer is opened. */
  const isOpen = ({ open }: ItemProps): boolean => {
    return self.current ? open : false;
  };

  /** Returns the class name of the wrapper. */
  const getWrapperClass = ({ prefixClass, placement, className, showMask, open }: ItemProps): string => {
    return classnames(prefixClass, {
      [`${prefixClass}-${placement}`]: true,
      [`${prefixClass}-open`]: isOpen({open: open} as ItemProps),
      [className || '']: !!className,
      'no-mask': !showMask,
    });
  };

  /** Returns the `transform` CSS property. */
  const getTransform = ({ open, placement }: ItemProps): string => {
    const position = placement === 'left' || placement === 'top' ? '-100%' : '100%';
    return open ? '' : `${placement}(${position})`;
  };

  /** Rerturns the width of the component. */
  const getWidth = ({ width }: ItemProps): string => {
    return Utils.isNumeric(width) ? `${width}px` : width as string;
  };

  /** Rerturns the height of the component. */
  const getHeight = ({ height }: ItemProps): string => {
    return Utils.isNumeric(height) ? `${height}px` : height as string;
  };

  const getHandlerElement = ({ handler, onHandleClick }: ItemProps): React.ReactElement<unknown> => {
    if (handler) {
      return React.cloneElement(handler, {
        onClick: (e: React.MouseEvent): void => {
          if (handler.props.onClick) handler.props.onClick();
          if (onHandleClick) onHandleClick(e);
        },
        ref: button,
      });
    }
    return <></>;
  };

  return (
    <div
      {...Utils.omit(props, ['switchScrollingEffect', 'autoFocus', 'onChange'])}
      tabIndex={-1}
      className={getWrapperClass(props)}
      style={props.style}
      ref={self}
      onKeyDown={isOpen(props) && props.keyboard ? onKeyDown : undefined}
      onTransitionEnd={onWrapperTransitionEnd}
    >
      {props.showMask && (
        <div
          className={`${props.prefixClass}-mask`}
          onClick={props.maskClosable ? props.onClose : undefined}
          style={props.maskStyle}
          ref={mask}
        />
      )}
      <div
        className={`${props.prefixClass}-content-wrapper`}
        style={{
          transform: getTransform(props),
          msTransform: getTransform(props),
          width: getWidth(props),
          height: getHeight(props),
          ...props.contentWrapperStyle,
        }}
        ref={wrapper}
      >
        <div
          className={`${props.prefixClass}-content`}
          ref={content}
        >
          {props.children}
        </div>
        {getHandlerElement(props)}
      </div>
    </div>
  );
};
