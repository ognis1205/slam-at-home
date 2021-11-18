/**
 * @fileoverview Defines {Item} component.
 */
import * as React from 'react';
import * as Utils from './utils';
import * as Props from './props';

export const Item: React.FunctionComponent<Props.Item> = (props: Props.Item): React.ReactElement => {
  /** A Multi-level drawer contents. */
  const [levels, setLevelsState] = React.useState<HTMLElement[]>([]);

  /** A current drawer flags. */
  const [currentDrawer] = React.useState<Record<string, boolean>>({});

  /** A passive mode support flag. */
  const [passive, setPassiveState] = React.useState<{ passive: boolean } | boolean>(false);

  /** A timeout duration. */
  const [timeout, setTimeoutState] = React.useState<any>(null);

  /** A drawing start duration. */
  const [startPosition, setStartPositionState] = React.useState<{x: number; y: number}>(null);

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

  /** Checks if some drawer is opened. */
  const isSomeDrawerOpened = (): boolean =>
    !Object.keys(currentDrawer).some(key => currentDrawer[key]);

  /** Checks if the drawer is opened. */
  const isOpen = (): boolean =>
    self.current ? props.open : false;

  /** Sets drawer level HTML elements. */
  const setLevels = (): void => {
    if (Utils.windowIsUndefined)
      return;

    const container = Props.getContainer(props);
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

  /** Removes a drawing start handler. */
  const setStartPosition = (e: React.TouchEvent | TouchEvent): void => {
    if (e.touches.length > 1) {
      setStartPositionState(null);
      return;
    }
    setStartPositionState({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  /** Opens a level with transition. */
  const openLevelTransition = (): void => {
    const isHorizontal = props.placement === 'left' || props.placement === 'right';
    const translateFunction = `translate${isHorizontal ? 'X' : 'Y'}`;
    const rect = 
      content.current
      ? content.current.getBoundingClientRect()[isHorizontal ? 'width' : 'height']
      : 0;
    const size = (isHorizontal ? props.width : props.height) || rect;

    if (!Utils.windowIsUndefined) {
      const right =
        document.body.scrollHeight >
          (window.innerHeight || document.documentElement.clientHeight) &&
        window.innerWidth > document.body.offsetWidth
          ? Utils.getScrollBarSize(true)
          : 0;
      setTransform(translateFunction, size, right);
      toggleScrolling(right);
    }
    if (props.onChange)
      props.onChange(props.open);
  };

  /** Sets a transform CSS function on assigned levels. */
  const setTransform = (translateFunction?: string, size?: string | number, right?: number): void => {
    levels.forEach(level => {
      level.style.transition = `transform ${props.drawDuration} ${props.drawEase}`;
      Utils.addEventListener(level, Utils.TRANSITION_END, onTransitionEnd);
      const width = Props.getDrawWidth(props, level, size);
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

  /** Toggles scrolling effects. */
  const toggleScrolling = (right: number): void => {
    const container = Props.getContainer(props);

    if (container && container.parentNode === document.body && props.showMask) {
      const events = ['touchstart'];
      const doms = [document.body, mask.current, button.current, content.current];
      if (props.open && document.body.style.overflow !== 'hidden') {
        if (right) addScrollingEffect(right);
        document.body.style.touchAction = 'none';
        doms.forEach((item, i) => {
          if (!item) return;
          Utils.addEventListener(
            item,
            events[i] || 'touchmove',
            i ? preventDefaultOnTouch : setStartPosition,
            passive,
          );
        });
      } else if (isSomeDrawerOpened()) {
        document.body.style.touchAction = '';
        if (right) removeScrollingEffect(right);
        doms.forEach((item, i) => {
          if (!item) return;
          Utils.removeEventListener(
            item,
            events[i] || 'touchmove',
            i ? preventDefaultOnTouch : setStartPosition,
            passive,
          );
        });
      }
    }
  };

  /** Adds scrolling effects. */
  const addScrollingEffect = (right: number): void => {
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

  /** Removes scrolling effects. */
  const removeScrollingEffect = (right: number): void => {
    if (Utils.transitionEndKey)
      document.body.style.overflowX = 'hidden';

    self.current.style.transition = 'none';
    let yTransition: string;
    let xTransition = `width ${props.drawDuration} ${props.drawEase}`;
    const transform = `transform ${props.drawDuration} ${props.drawEase}`;

    switch (props.placement) {
      case 'left': {
        self.current.style.width = '100%';
        xTransition = `width 0s ${props.drawEase} ${props.drawDuration}`;
        break;
      }
      case 'right': {
        self.current.style.transform = `translateX(${right}px)`;
        self.current.style.width = '100%';
        xTransition = `width 0s ${props.drawEase} ${props.drawDuration}`;
        if (mask.current) {
          mask.current.style.left = `-${right}px`;
          mask.current.style.width = `calc(100% + ${right}px)`;
        }
        break;
      }
      case 'top':
      case 'bottom': {
        self.current.style.width = `calc(100% + ${right}px)`;
        self.current.style.height = '100%';
        self.current.style.transform = 'translateZ(0)';
        yTransition = `height 0s ${props.drawEase} ${props.drawDuration}`;
        break;
      }
      default:
        break;
    }

    clearTimeout(timeout);
    setTimeoutState(setTimeout(() => {
      if (self.current) {
        self.current.style.transition = `${transform},${
          yTransition ? `${yTransition},` : ''
        }${xTransition}`;
        self.current.style.transform = '';
        self.current.style.width = '';
        self.current.style.height = '';
      }
    }));
  };

  /** Removes touch event handlers. */
  const preventDefaultOnTouch = (e: React.TouchEvent | TouchEvent): void => {
    if (e.changedTouches.length > 1 || !startPosition)
      return;

    const el = e.currentTarget as HTMLElement;
    const dx = e.changedTouches[0].clientX - startPosition.x;
    const dy = e.changedTouches[0].clientY - startPosition.y;

    const isMaskTouched =
      el === mask.current;
    const isButtonTouched =
      el === button.current;
    const isContentTouched = 
      el === content.current && Utils.isParentScrolling(el, e.target as HTMLElement, dx, dy);
    const isTouched =
      isMaskTouched || isButtonTouched || isContentTouched;

    if (isTouched && e.cancelable)
      e.preventDefault();
  };

  /** An event handler called on `transitionend` events. */
  const onTransitionEnd = (e: TransitionEvent): void => {
    const target: HTMLElement = e.target as HTMLElement;
    Utils.removeEventListener(target, Utils.TRANSITION_END, onTransitionEnd);
    target.style.transition = '';
  };

  /** An event handler called on 'keyboardevent' events. */
  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      if (props.onClose) props.onClose(e as any);
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

  /** Clones a handler element. */
  const cloneHandlerElement = (): React.ReactElement<unknown> => {
    const {handler, onHandleClick} = props;
    if (Props.isReactElement(handler)) {
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
      className={Props.getWrapperClass(props, isOpen())}
      style={props.style}
      ref={self}
      onKeyDown={isOpen() && props.keyboard ? onKeyDown : undefined}
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
          transform: Props.getTransform(props),
          msTransform: Props.getTransform(props),
          width: Props.getWidth(props),
          height: Props.getHeight(props),
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
        {cloneHandlerElement()}
      </div>
    </div>
  );
};
