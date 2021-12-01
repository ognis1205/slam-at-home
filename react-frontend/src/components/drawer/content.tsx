/**
 * @fileoverview Defines Content component.
 */
import * as React from 'react';
import * as Props from './props';
import * as DOM from '../../utils/dom';
import * as Event from '../../utils/event';
import * as Hook from '../../utils/hook';
import * as Misc from '../../utils/misc';
import * as Scroll from '../../utils/scroll';
import classnames from 'classnames';

/** Returns the class name of the wrapper. */
const getWrapperClass = (
  {prefixClass, placement, className, showMask}: Props.Content,
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
const getTransform = ({open, placement}: Props.Content): string => {
  const position = placement === 'left' || placement === 'top' ? '-100%' : '100%';
  return open ? '' : `${placement}(${position})`;
};

/** Rerturns the width of the component. */
const getWidth = ({width}: Props.Content): string => {
  return Misc.isNumeric(width) ? `${width}px` : width as string;
};

/** Rerturns the height of the component. */
const getHeight = ({height}: Props.Content): string => {
  return Misc.isNumeric(height) ? `${height}px` : height as string;
};

/** Returns a draw width. */
const getDrawWidth = (
  {open, drawWidth}: Props.Content,
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

/** Returns the container element of a drawer content. */
const getContainer = ({container}: Props.Content): HTMLElement => {
  return DOM.get(container);
};

/** Checks if a given handler is `ReactElement.` */
const isReactElement = (
  handler: React.ReactElement | null | false
): handler is React.ReactElement => {
  return handler !== false && handler !== null;
};

/** @const Holds a current drawer flags. */
const CURRENT_DRAWER: Record<string, boolean> = {};

/**
 * Returns a `Content` component.
 * @param {Content} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Content> = (props: Props.Content): React.ReactElement => {
  /** @const Holds a force updater. */
  const forceUpdate = Hook.useForceUpdate();

  /** @const Holds a component's identifier. */
  const id = React.useRef<string>(
    `drawer_id_${Number(
      (Date.now() + Math.random())
        .toString()
        .replace('.', Math.round(Math.random() * 9).toString()),
    ).toString(16)}`);

  /** @const Holds drawer items. */
  const items = React.useRef<HTMLElement[]>([]);

  /** @const Holds a passive mode support flag. */
  const passive = React.useRef<{ passive: boolean } | boolean>(false);

  /** @const Holds a drawing start position. */
  const startPosition = React.useRef<{x: number; y: number}>(null);

  /** @const Holds a after-scrolling effect. */
  const afterScrolling = React.useRef<any>(null);

  /** @const Holds a reference to the component itself. */
  const self = React.useRef<HTMLDivElement>(null);

  /** @const Holds a reference to the mask element. */
  const mask = React.useRef<HTMLDivElement>(null);

  /** @const Holds a reference to the wrapper element. */
  const wrapper = React.useRef<HTMLDivElement>(null);

  /** @const Holds a reference to the drawer content element. */
  const content = React.useRef<HTMLDivElement>(null);

  /** @const Holds a reference to the draw handler element. */
  const button = React.useRef<HTMLElement>(null);

  /** `getDerivedStateFromProps` */
  React.useEffect(() => {
    init();
    forceUpdate();
  }, [props.drawLevel]);

  /** `getDerivedStateFromProps` */
  React.useEffect(() => {
    content.current = null;
    forceUpdate();
  }, [props.placement]);

  /** `componentDidMount` */
  Hook.useDidMount(() => {
    init();
    const container = getContainer(props);
    if (props.open) {
      if (container && container.parentNode === document.body)
        CURRENT_DRAWER[id.current] = props.open;
      toggle();
      if (props.autoFocus)
        focus();
      if (props.showMask)
        props.scrollLocker?.lock();
    }
  });

  /** `componentDidUpdate` */
  Hook.useDidUpdate(() => {
    const container = getContainer(props);
    if (container && container.parentNode === document.body)
      CURRENT_DRAWER[id.current] = !!props.open;
    toggle();
    if (props.open) {
      if (props.autoFocus)
        focus();
      if (props.showMask)
        props.scrollLocker?.lock();
      else
        props.scrollLocker?.unlock();
    }
  }, [props.open]);

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    delete CURRENT_DRAWER[id.current];
    if (props.open) {
      props.open = false;
      setTransform();
      document.body.style.touchAction = '';
    }
    props.scrollLocker?.unlock();
  });

  /** Checks if some drawers are opened. */
  const isSomeDrawerOpened = (): boolean =>
    !Object.keys(CURRENT_DRAWER).some(key => CURRENT_DRAWER[key]);

  /** Checks if the drawer is opened. */
  const isOpen = (): boolean =>
    self.current ? props.open : false;

  /** Focuses on this component forcelly. */
  const focus = (): void =>
      self.current?.focus();

  /** Inits drawer item HTML elements. */
  const init = (): void => {
    if (!DOM.isDefined())
      return;

    let passiveIsSupported = false;
    try {
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: () => {
            passiveIsSupported = true;
            return null
          },
        }),
      );
    } catch (_) {}
    passive.current = passiveIsSupported ? { passive: false } : false;

    const container = getContainer(props);
    const parent = container ? (container.parentNode as HTMLElement) : null;
    const children = parent ? Array.prototype.slice.call(parent.children) : [];
    items.current = [] as HTMLElement[];

    if (props.drawLevel === 'all') {
      children.forEach((child: HTMLElement) => {
        if (child.nodeName !== 'SCRIPT' &&
            child.nodeName !== 'STYLE' &&
            child.nodeName !== 'LINK' &&
            child !== container
        ) items.current?.push(child);
      });
    } else if (props.drawLevel) {
      Misc.toArray(props.drawLevel).forEach(key => {
        document.querySelectorAll(key).forEach(item => items.current?.push(item));
      });
    }
  };

  /** Toggles a drawer. */
  const toggle = (): void => {
    const isHorizontal = props.placement === 'left' || props.placement === 'right';
    const translateFunction = `translate${isHorizontal ? 'X' : 'Y'}`;
    const rect = 
      content.current
      ? content.current.getBoundingClientRect()[isHorizontal ? 'width' : 'height']
      : 0;
    const size = (isHorizontal ? props.width : props.height) || rect;

    if (DOM.isDefined()) {
      const right =
        document.body.scrollHeight >
          (window.innerHeight || document.documentElement.clientHeight) &&
        window.innerWidth > document.body.offsetWidth
          ? Scroll.getBarSize(true)
          : 0;
      setTransform(translateFunction, size, right);
      toggleScrolling(right);
    }

    if (props.onChange)
      props.onChange(props.open);
  };

  /** Sets a transform CSS function on assigned items. */
  const setTransform = (translateFunction?: string, size?: string | number, right?: number): void => {
    items.current?.forEach(item => {
      item.style.transition = `transform ${props.drawDuration} ${props.drawEase}`;
      Event.addListener(item, Event.TRANSITION_END, onTransitionEnd);
      const width = getDrawWidth(props, item, size);
      const pixel = 
        typeof width === 'number'
        ? `${width}px`
        : width;
      let position = 
        props.placement === 'left' || props.placement === 'top'
        ? pixel
        : `-${pixel}`;
      position = 
        props.showMask && props.placement === 'right' && right
        ? `calc(${position} + ${right}px)`
        : position;
      item.style.transform =
        width
        ? `${translateFunction}(${position})`
        : '';
    });
  };

  /** Toggles scrolling effects. */
  const toggleScrolling = (right: number): void => {
    const container = getContainer(props);
    if (container && container.parentNode === document.body && props.showMask) {
      const events = ['touchstart'];
      const doms = [document.body, mask.current, button.current, content.current];
      if (props.open && document.body.style.overflow !== 'hidden') {
        if (right) addScrolling(right);
        document.body.style.touchAction = 'none';
        doms.forEach((item, i) => {
          if (!item) return;
          Event.addListener(
            item,
            events[i] || 'touchmove',
            i ? preventDefaultOnTouch : onTouchMove,
            passive,
          );
        });
      } else if (isSomeDrawerOpened()) {
        document.body.style.touchAction = '';
        if (right) removeScrolling(right);
        doms.forEach((item, i) => {
          if (!item) return;
          Event.removeListener(
            item,
            events[i] || 'touchmove',
            i ? preventDefaultOnTouch : onTouchMove,
            passive,
          );
        });
      }
    }
  };

  /** Adds scrolling effects. */
  const addScrolling = (right: number): void => {
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

    clearTimeout(afterScrolling.current);
    afterScrolling.current = setTimeout(() => {
      if (self.current) {
        self.current.style.transition = `${transformTransition},${widthTransition}`;
        self.current.style.width = '';
        self.current.style.transform = '';
      }
    });
  };

  /** Removes scrolling effects. */
  const removeScrolling = (right: number): void => {
    if (Event.transitionEndKey)
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

    clearTimeout(afterScrolling.current);
    afterScrolling.current = setTimeout(() => {
      if (self.current) {
        self.current.style.transition = `${transform},${
          yTransition ? `${yTransition},` : ''
        }${xTransition}`;
        self.current.style.transform = '';
        self.current.style.width = '';
        self.current.style.height = '';
      }
    });
  };

  /** Removes touch event handlers. */
  const preventDefaultOnTouch = (e: React.TouchEvent | TouchEvent): void => {
    if (e.changedTouches.length > 1 || !startPosition.current)
      return;

    const el = e.currentTarget as HTMLElement;
    const dx = e.changedTouches[0].clientX - startPosition.current?.x;
    const dy = e.changedTouches[0].clientY - startPosition.current?.y;

    const isMaskTouched =
      el === mask.current;
    const isButtonTouched =
      el === button.current;
    const isContentTouched = 
      el === content.current && Scroll.isScrolling(el, e.target as HTMLElement, dx, dy);
    const isTouched =
      isMaskTouched || isButtonTouched || isContentTouched;

    if (isTouched && e.cancelable)
      e.preventDefault();
  };

  /** An event handler called on `touchmove` events. */
  const onTouchMove = (e: React.TouchEvent | TouchEvent): void => {
    if (e.touches.length > 1)
      startPosition.current = null;
    else
      startPosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
  };

  /** An event handler called on `transitionend` events. */
  const onTransitionEnd = (e: TransitionEvent): void => {
    const target: HTMLElement = e.target as HTMLElement;
    Event.removeListener(target, Event.TRANSITION_END, onTransitionEnd);
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
    const {handler} = props;
    if (isReactElement(handler))
      return React.cloneElement(handler, {
        onClick: (e: React.MouseEvent): void => {
          if (handler.props.onClick)
            handler.props.onClick();
          if (props.onHandleClick)
            props.onHandleClick(e);
        },
        ref: button,
      });
    else
      return null;
  };

  /** Separates HTML attributes. */
  const {
    className,
    children,
    style,
    width,
    height,
    defaultOpen,
    open,
    prefixClass,
    placement,
    drawLevel,
    drawWidth,
    drawEase,
    drawDuration,
    container,
    handler,
    onChange,
    afterVisibleChange,
    showMask,
    maskClosable,
    maskStyle,
    onClose,
    onHandleClick,
    keyboard,
    getOpenCount,
    scrollLocker,
    contentWrapperStyle,
    switchScrollingEffect,
    autoFocus,
    ...htmlAttrs
  } = props;

  return (
    <div
      {...htmlAttrs}
      tabIndex={-1}
      className={getWrapperClass(props, isOpen())}
      style={style}
      ref={self}
      onKeyDown={isOpen() && keyboard ? onKeyDown : undefined}
      onTransitionEnd={onWrapperTransitionEnd}
    >
      {showMask && (
        <div
          className={`${prefixClass}-mask`}
          onClick={maskClosable ? onClose : undefined}
          style={maskStyle}
          ref={mask}
        />
      )}
      <div
        className={`${prefixClass}-content-wrapper`}
        style={{
          transform: getTransform(props),
          msTransform: getTransform(props),
          width: getWidth(props),
          height: getHeight(props),
          ...contentWrapperStyle,
        }}
        ref={wrapper}
      >
        <div
          className={`${prefixClass}-content`}
          ref={content}
        >
          {children}
        </div>
        {cloneHandlerElement()}
      </div>
    </div>
  );
};
