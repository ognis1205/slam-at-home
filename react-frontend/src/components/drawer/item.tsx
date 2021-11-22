/**
 * @fileoverview Defines Item component.
 */
import * as React from 'react';
import * as Props from './props';
import * as DOM from '../../utils/dom';
import * as Event from '../../utils/event';
import * as Hook from '../../utils/hook';
import * as Misc from '../../utils/misc';
import * as Scroll from '../../utils/scroll';

/**
 * Returns a `Item` component.
 * @param {Item} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Item: React.FunctionComponent<Props.Item> = (props: Props.Item): React.ReactElement => {
  /** @const Holds a component identifier's state. */
  const [id, setId] = React.useState<string>(null);

  /** @const Holds a multi-level drawer contents' state. */
  const [levels, setLevels] = React.useState<HTMLElement[]>([]);

  /** @const Holds a passive mode support flag's state. */
  const [passive, setPassive] = React.useState<{ passive: boolean } | boolean>(false);

  /** @const Holds a drawing start position's state. */
  const [startPosition, setStartPosition] = React.useState<{x: number; y: number}>(null);

  /** @const Holds a after-scrolling effect's state. */
  const [afterScrolling, setAfterScrolling] = React.useState<any>(null);

  /** @const Holds a current drawer flags' state. */
  const [currentDrawer] = React.useState<Record<string, boolean>>({});

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
    initLevels();
  }, [props.drawLevel]);

  /** `getDerivedStateFromProps` */
  React.useEffect(() => {
    content.current = null;
  }, [props.placement]);

  /** `componentDidMount` */
  Hook.useDidMount(() => {
    const container = Props.getContainer(props);
    initId();
    initPassive();
    initLevels();

    if (props.open) {
      if (container && container.parentNode === document.body)
        currentDrawer[id] = props.open;
      openLevel();
      if (props.autoFocus)
        focus();
      if (props.showMask)
        props.scrollLocker?.lock();
    }
  });

  /** `componentDidUpdate` */
  Hook.useDidUpdate(() => {
    const container = Props.getContainer(props);

    if (container && container.parentNode === document.body)
      currentDrawer[id] = !!props.open;
    openLevel();

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
    delete currentDrawer[id];
    if (props.open) {
      props.open = false;
      setTransform();
      document.body.style.touchAction = '';
    }
    props.scrollLocker?.unlock();
  });

  /** Checks if some drawers are opened. */
  const isSomeDrawerOpened = (): boolean =>
    !Object.keys(currentDrawer).some(key => currentDrawer[key]);

  /** Checks if the drawer is opened. */
  const isOpen = (): boolean =>
    self.current ? props.open : false;

  /** Focuses on this component forcelly. */
  const focus = (): void => {
    if (self.current)
      self.current.focus();
  };

  /** Inits the `id`. */
  const initId = (): void => {
    setId(`drawer_id_${Number(
      (Date.now() + Math.random())
        .toString()
        .replace('.', Math.round(Math.random() * 9).toString()),
    ).toString(16)}`);
  };

  /** Inits the `passive` support. */
  const initPassive = (): void => {
    if (!DOM.isWindowUndefined) {
      let passiveSupported = false;
      try {
        window.addEventListener(
          'test',
          null,
          Object.defineProperty({}, 'passive', {
            get: () => {
              passiveSupported = true;
              return null
            },
          }),
        );
      } catch (_) {}
      setPassive(passiveSupported ? { passive: false } : false);
    }
  };

  /** Inits drawer level HTML elements. */
  const initLevels = (): void => {
    if (DOM.isWindowUndefined)
      return;

    const container = Props.getContainer(props);
    const parent = container ? (container.parentNode as HTMLElement) : null;
    setLevels([] as HTMLElement[]);

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
      Misc.toArray(props.drawLevel).forEach(key => {
        document.querySelectorAll(key).forEach(item => levels.push(item));
      });
    }
  };

  /** Removes a drawing start handler. */
  const initStartPosition = (e: React.TouchEvent | TouchEvent): void => {
    if (e.touches.length > 1) {
      setStartPosition(null);
      return;
    }
    setStartPosition({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  /** Opens a level. */
  const openLevel = (): void => {
    const isHorizontal = props.placement === 'left' || props.placement === 'right';
    const translateFunction = `translate${isHorizontal ? 'X' : 'Y'}`;
    const rect = 
      content.current
      ? content.current.getBoundingClientRect()[isHorizontal ? 'width' : 'height']
      : 0;
    const size = (isHorizontal ? props.width : props.height) || rect;

    if (!DOM.isWindowUndefined) {
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

  /** Sets a transform CSS function on assigned levels. */
  const setTransform = (translateFunction?: string, size?: string | number, right?: number): void => {
    levels.forEach(level => {
      level.style.transition = `transform ${props.drawDuration} ${props.drawEase}`;
      Event.addListener(level, Event.TRANSITION_END, onTransitionEnd);
      const width = Props.getDrawWidth(props, level, size);
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
          Event.addListener(
            item,
            events[i] || 'touchmove',
            i ? preventDefaultOnTouch : initStartPosition,
            passive,
          );
        });
      } else if (isSomeDrawerOpened()) {
        document.body.style.touchAction = '';
        if (right) removeScrollingEffect(right);
        doms.forEach((item, i) => {
          if (!item) return;
          Event.removeListener(
            item,
            events[i] || 'touchmove',
            i ? preventDefaultOnTouch : initStartPosition,
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

    clearTimeout(afterScrolling);
    setAfterScrolling(setTimeout(() => {
      if (self.current) {
        self.current.style.transition = `${transformTransition},${widthTransition}`;
        self.current.style.width = '';
        self.current.style.transform = '';
      }
    }));
  };

  /** Removes scrolling effects. */
  const removeScrollingEffect = (right: number): void => {
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

    clearTimeout(afterScrolling);
    setAfterScrolling(setTimeout(() => {
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
      el === content.current && Scroll.isScrolling(el, e.target as HTMLElement, dx, dy);
    const isTouched =
      isMaskTouched || isButtonTouched || isContentTouched;

    if (isTouched && e.cancelable)
      e.preventDefault();
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
      {...Misc.omit(props, ['switchScrollingEffect', 'autoFocus', 'onChange'])}
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
