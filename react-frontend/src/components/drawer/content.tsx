/**
 * @fileoverview Defines Content component.
 * @copyright Shingo OKAWA 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from 'react';
import * as Props from './props';
import * as DOM from '../../utils/dom';
import * as Event from '../../utils/event';
import * as Hook from '../../utils/hook';
import * as Misc from '../../utils/misc';
import * as Scroll from '../../utils/scroll';
import classnames from 'classnames';
import styles from '../../assets/styles/components/drawer.module.scss';

/** Returns the class name of the wrapper. */
const getClassName = (
  {placement, className, showMask}: Props.Content,
  open: boolean
): string =>
  classnames(styles['drawer'], {
    [styles[placement]]: true,
    [styles['open']]: open,
    [styles['no-mask']]: !showMask,
    [className || '']: !!className,
  });

/** Returns the `transform` CSS property. */
const getTransform = ({open, placement}: Props.Content): string => {
  const position = placement === 'left' || placement === 'top' ? '-100%' : '100%';
  const isHorizontal = placement === 'left' || placement === 'right';
  const translateFunction = `translate${isHorizontal ? 'X' : 'Y'}`;
  return open ? '' : `${translateFunction}(${position})`;
};

/** Rerturns the width of the component. */
const getWidth = ({width}: Props.Content): string =>
  Misc.isNumeric(width) ? `${width}px` : width as string;

/** Rerturns the height of the component. */
const getHeight = ({height}: Props.Content): string =>
  Misc.isNumeric(height) ? `${height}px` : height as string;

/** Returns a draw width. */
const getDrawWidthIfOpened = (
  {open, drawWidth}: Props.Content,
  target: HTMLElement,
  size: string | number
): string | number | undefined => {
  let ret = open ? size : undefined;
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
const getContainer = ({container}: Props.Content): HTMLElement =>
  DOM.get(container);

/** Checks if a given handler is `ReactElement.` */
const isReactElement = (
  handler: React.ReactElement | null | false
): handler is React.ReactElement =>
  handler !== false && handler !== null;

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

  /** @const Holds panes other than a drawer. */
  const panes = React.useRef<HTMLElement[]>([]);

  /** @const Holds a passive mode support flag. */
  const passive = React.useRef<{ passive: boolean } | boolean>(false);

  /** @const Holds a drawing start position. */
  const startPosition = React.useRef<{x: number; y: number}>(null);

  /** @const Holds a after-scrolling effect. */
  const timeout = React.useRef<any>(null);

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
    if (props.open) {
      if (getContainer(props)?.parentNode === document.body)
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
    if (getContainer(props)?.parentNode === document.body)
      CURRENT_DRAWER[id.current] = !!props.open;
    toggle();
    if (props.open) {
      if (props.autoFocus)
        focus();
      if (props.showMask)
        props.scrollLocker?.lock();
    } else {
      props.scrollLocker?.unlock();
    }
  }, [props.open]);

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    delete CURRENT_DRAWER[id.current];
    if (props.open) {
      props.open = false;
      togglePanes();
      document.body.style.touchAction = '';
    }
    props.scrollLocker?.unlock();
  });

  /** Checks if some drawers are opened. */
  const areAllDrawersClosed = (): boolean =>
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
    panes.current = [] as HTMLElement[];

    if (props.drawLevel === 'all') {
      children.forEach((child: HTMLElement) => {
        if (child.nodeName !== 'SCRIPT' &&
            child.nodeName !== 'STYLE' &&
            child.nodeName !== 'LINK' &&
            child !== container
        ) panes.current?.push(child);
      });
    } else if (props.drawLevel) {
      Misc.toArray(props.drawLevel).forEach(key => {
        document.querySelectorAll(key).forEach(item => panes.current?.push(item));
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
      const scrollBarSize =
        document.body.scrollHeight >
          (window.innerHeight || document.documentElement.clientHeight) &&
        window.innerWidth > document.body.offsetWidth
          ? Scroll.getBarSize(true)
          : 0;
      togglePanes(translateFunction, size, scrollBarSize);
      toggleEvents(scrollBarSize);
    }

    if (props.onChange)
      props.onChange(props.open);
  };

  /** Sets a transform CSS function on panes. */
  const togglePanes = (translateFunction?: string, size?: string | number, scrollBarSize?: number): void =>
    panes.current?.forEach(pane => {
      pane.style.transition = `transform ${props.drawDuration} ${props.drawEase}`;
      Event.addListener(pane, Event.TRANSITION_END, onTransitionEnd);
      let diff = getDrawWidthIfOpened(props, pane, size);
      diff = 
        typeof diff === 'number'
        ? `${diff}px`
        : diff;
      diff = 
        props.placement === 'left' || props.placement === 'top'
        ? diff
        : `-${diff}`;
      diff = 
        props.showMask && props.placement === 'right' && scrollBarSize
        ? `calc(${diff} + ${scrollBarSize}px)`
        : diff;
      pane.style.transform =
        diff
        ? `${translateFunction}(${diff})`
        : '';
    });

  /** Toggles event listeners. */
  const toggleEvents = (scrollBarSize: number): void => {
    if (getContainer(props)?.parentNode === document.body && props.showMask) {
      const doms = [document.body, mask.current, button.current, content.current];
      if (props.open && document.body.style.overflow !== 'hidden') {
        if (scrollBarSize)
          showWithScrollBar(scrollBarSize);
        document.body.style.touchAction = 'none';
        doms.forEach((item, i) => {
          if (!item)
            return;
          Event.addListener(
            item,
            i ? 'touchmove' : 'touchstart',
            i ? preventDefaultOnTouch : onTouchMove,
            passive,
          );
        });
      } else if (areAllDrawersClosed()) {
        if (scrollBarSize)
          hideWithScrollBar(scrollBarSize);
        document.body.style.touchAction = '';
        doms.forEach((item, i) => {
          if (!item)
            return;
          Event.removeListener(
            item,
            i ? 'touchmove' : 'touchstart',
            i ? preventDefaultOnTouch : onTouchMove,
            passive,
          );
        });
      }
    }
  };

  /** Shows a drawer with a scroll bar size. */
  const showWithScrollBar = (scrollBarSize: number): void => {
    const xTransition = `width ${props.drawDuration} ${props.drawEase}`;
    const transformTransition = `transform ${props.drawDuration} ${props.drawEase}`;

    self.current.style.transition = 'none';
    switch (props.placement) {
      case 'right':
        self.current.style.transform = `translateX(-${scrollBarSize}px)`;
        break;
      case 'top':
      case 'bottom':
        self.current.style.width = `calc(100% - ${scrollBarSize}px)`;
        self.current.style.transform = 'translateZ(0)';
        break;
      default:
        break;
    }

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (self.current) {
        self.current.style.transition = `${transformTransition},${xTransition}`;
        self.current.style.width = '';
        self.current.style.transform = '';
      }
    });
  };

  /** Hides a drawer with a scroll bar size. */
  const hideWithScrollBar = (scrollBarSize: number): void => {
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
        self.current.style.transform = `translateX(${scrollBarSize}px)`;
        self.current.style.width = '100%';
        xTransition = `width 0s ${props.drawEase} ${props.drawDuration}`;
        if (mask.current) {
          mask.current.style.left = `-${scrollBarSize}px`;
          mask.current.style.width = `calc(100% + ${scrollBarSize}px)`;
        }
        break;
      }
      case 'top':
      case 'bottom': {
        self.current.style.width = `calc(100% + ${scrollBarSize}px)`;
        self.current.style.height = '100%';
        self.current.style.transform = 'translateZ(0)';
        yTransition = `height 0s ${props.drawEase} ${props.drawDuration}`;
        break;
      }
      default:
        break;
    }

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (self.current) {
        self.current.style.transition = `${transform},${
          yTransition ? '${yTransition},' : ''
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
      if (props.onClose)
        props.onClose(e as any);
    }
  };

  /** An event handler called on 'transitionend' events of the wrapper. */
  const onWrapperTransitionEnd = (e: React.TransitionEvent): void => {
    const { open, afterVisibleChange } = props;
    if (e.target === wrapper.current && e.propertyName.match(/transform$/)) {
      if (self.current)
        self.current.style.transition = '';
      if (!open && areAllDrawersClosed()) {
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
        ref: (el: HTMLElement) => {button.current = el},
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
    open,
    defaultOpen,
    handler,
    placement,
    drawLevel,
    drawWidth,
    drawDuration,
    drawEase,
    showMask,
    maskClosable,
    maskStyle,
    onChange,
    afterVisibleChange,
    onHandleClick,
    onClose,
    keyboard,
    wrapperStyle,
    autoFocus,
    container,
    getOpenCount,
    scrollLocker,
    switchScrollingEffect,
    visible,
    afterClose,
    ...htmlAttrs
  } = props;

  return (
    <div
      {...htmlAttrs}
      tabIndex={-1}
      className={getClassName(props, isOpen())}
      style={style}
      ref={(el) => self.current = el}
      onKeyDown={isOpen() && keyboard ? onKeyDown : undefined}
      onTransitionEnd={onWrapperTransitionEnd}
    >
      {showMask && (
        <div
          className={styles['mask']}
          onClick={maskClosable ? onClose : undefined}
          style={maskStyle}
          ref={(el) => mask.current = el}
        />
      )}
      <div
        className={styles['wrapper']}
        style={{
          transform: getTransform(props),
          msTransform: getTransform(props),
          width: getWidth(props),
          height: getHeight(props),
          ...wrapperStyle,
        }}
        ref={(el) => wrapper.current = el}
      >
        <div
          className={styles['content']}
          ref={(el) => content.current = el}
        >
          {children}
        </div>
        {cloneHandlerElement()}
      </div>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'DrawerContent';
