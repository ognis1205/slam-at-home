/**
 * @fileoverview Defines Panel component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import * as Window from './window';
import * as Navigation from '../navigation';
import * as Draggable from '../../components/draggable';
import * as CSS from '../../utils/css';
import * as DOM from '../../utils/dom';
import * as Event from '../../utils/event';
import * as Hook from '../../utils/hook';
import * as Position from '../../utils/position';
import * as Wrap from '../../utils/wrap';
import classnames from 'classnames';
import styles from '../../assets/styles/containers/panel.module.scss';

/** Default properties. */
const DEFAULT_PROPS = {
  defaultPosition: { x: 250, y: 0 },
  width: 10,
  leftmost: 250,
  rightmost: 250,
};

/** Returns a `Left` component. */
const Left = React.forwardRef<HTMLDivElement, Props.Left>(
  ({ children, ...divProps }: Props.Left, ref) => (
    <div ref={ref} className={styles['left']} {...divProps}>
      {children}
    </div>
  )
);

/** Sets the component's display name. */
Left.displayName = 'Left';

/** Returns a `Right` component. */
const Right = React.forwardRef<HTMLDivElement, Props.Right>(
  ({ children, className, ...divProps }: Props.Right, ref) => (
    <div
      ref={ref}
      className={classnames(styles['right'], {
        [className || '']: !!className,
      })}
      {...divProps}
    >
      {children}
    </div>
  )
);

/** Sets the component's display name. */
Right.displayName = 'Right';

/** Returns a `Divider` component. */
const Divider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (divProps: React.HTMLAttributes<HTMLDivElement>, ref): React.ReactElement => (
    <div {...divProps} ref={ref} className={styles['divider']}>
      {null}
    </div>
  )
);

/** Sets the component's display name. */
Divider.displayName = 'Divider';

/** Returns a `Panel` component. */
export const Component: React.FunctionComponent<Props.Panel> = ({
  children,
  width,
  leftmost,
  rightmost,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  allowAnyClick,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStart,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStop,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMouseDown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  grid,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  axis,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scale,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bounds,
  position,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  positionOffset,
  defaultPosition,
  ...divProps
}: Props.Panel): React.ReactElement => {
  /** @const Holds a force updater. */
  const forceUpdate = Hook.useForceUpdate();

  /** @const Holds opening directory state. */
  const [activeKey, setActiveKey] = React.useState<string[] | string>([
    'menu',
    'contribution',
    'about',
  ]);

  /** @const Holds a dragging position. */
  const [coord, setCoord] = React.useState<{ x: number; y: number }>({
    x: position?.x || defaultPosition?.x || 0,
    y: position?.y || defaultPosition?.y || 0,
  });

  /** An event handler called on `menu` events. */
  const handleMenuOpen = (): void => {
    toggleMenuOpened();
    forceUpdate();
  };

  /** An event handler called on `maximize` events. */
  const handleMaximize = (): void => {
    toggleMaximized();
    if (!isMaximized()) init();
    else maximize();
    forceUpdate();
  };

  /** An event handler called on `onchange` events. */
  const handleKeyActivated = (key: string): void => setActiveKey(key);

  /** @const Holds a reference to the divider. */
  const divider = React.useRef<HTMLDivElement>(null);

  /** @const Holds a reference to the left. */
  const left = React.useRef<HTMLDivElement>(null);

  /** @const Holds a reference to the right. */
  const right = React.useRef<HTMLDivElement>(null);

  /** @const Holds a menu opened flag. */
  const hasMenuOpened = React.useRef(false);

  /** Returns `true` if the menu has opned. */
  const isMenuOpened = (): boolean => hasMenuOpened.current;

  /** Toggles menu flag. */
  const toggleMenuOpened = (): void => {
    hasMenuOpened.current = !hasMenuOpened.current;
  };

  /** @const Holds a maximized flag. */
  const hasMaximized = React.useRef(false);

  /** Returns `true` if the component has maximized. */
  const isMaximized = (): boolean => hasMaximized.current;

  /** Toggles maximize flag. */
  const toggleMaximized = (): void => {
    hasMaximized.current = !hasMaximized.current;
  };

  /** @const Holds a mounted flag. */
  const hasMounted = React.useRef(false);

  /** Returns `true` if the component has mounted. */
  const isMounted = (): boolean => hasMounted.current;

  /** @const Holds a dragging state. */
  const isDragging = React.useRef<boolean>(false);

  /** Returns `true` if the component is dragging. */
  const checkIfDragging = (): boolean => isDragging.current;

  /** Sets the dragging flag. */
  const setDragging = (flag: boolean): boolean => (isDragging.current = flag);

  /** `getDerivedStateFromProps` */
  React.useEffect(() => {
    if (isMounted()) drag();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coord]);

  /** `componentDidMount` */
  Hook.useDidMount(() => {
    hasMounted.current = true;
    if (!DOM.isDefined()) return;
    Event.addListener(window, 'resize', resize);
    init();
  });

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    if (!DOM.isDefined()) return;
    Event.removeListener(window, 'resize', resize);
  });

  /** Inits drawer item HTML elements. */
  const init = (): void => {
    CSS.set(
      {
        width: `${width}px`,
      },
      divider.current
    );
    setCoord({
      x: defaultPosition?.x || 0,
      y: defaultPosition?.y || 0,
    });
  };

  /** Sets a CSS style on panes. */
  const resize = (): void => {
    if (!isMaximized()) init();
    else maximize();
  };

  /** Sets a CSS style on panes. */
  const maximize = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [windowWidth, windowHeight] = DOM.getWindowSize();
    CSS.set(
      {
        transform: `translateX(${defaultPosition?.x || 0}px)`,
      },
      divider.current
    );
    CSS.set(
      {
        width: `${defaultPosition?.x || 0}px`,
      },
      left.current
    );
    CSS.set(
      {
        left: '0px',
        width: `${windowWidth}px`,
      },
      right.current
    );
  };

  /** Sets a CSS style on panes. */
  const drag = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [windowWidth, windowHeight] = DOM.getWindowSize();
    CSS.set(
      {
        transform: `translateX(${coord.x}px)`,
      },
      divider.current
    );
    CSS.set(
      {
        width: `${coord.x}px`,
      },
      left.current
    );
    CSS.set(
      {
        left: `${coord.x + width}px`,
        width: `${windowWidth - coord.x - width}px`,
      },
      right.current
    );
  };

  /** An event handler called on `start` events. */
  const handleStart = (e: MouseEvent, drag: Position.Drag): void | false => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [width, height] = DOM.getWindowSize();
    if (drag.x < leftmost || drag.x > width - rightmost) return false;
    setDragging(true);
  };

  /** An event handler called on `move` events. */
  const handleMove = (e: MouseEvent, drag: Position.Drag): void | false => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [width, height] = DOM.getWindowSize();
    if (!checkIfDragging() || drag.x < leftmost || drag.x > width - rightmost)
      return false;
    const newCoord = { x: drag.x, y: drag.y };
    setCoord(newCoord);
  };

  /** An event handler called on `stop` events. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStop = (e: MouseEvent, drag: Position.Drag): void | false => {
    setDragging(false);
  };

  return (
    <div {...divProps} className={styles['panel']}>
      <Left style={{ width: `${leftmost}px` }} ref={left}>
        <Navigation.Context.Provider
          value={{ activeKeyContext: [activeKey, handleKeyActivated] }}
        >
          <Navigation.Component />
        </Navigation.Context.Provider>
      </Left>
      <Draggable.Wrapper
        axis={'x'}
        defaultPosition={{ x: leftmost, y: 0 }}
        onStart={handleStart}
        onMove={handleMove}
        onStop={handleStop}
      >
        <Divider ref={divider} />
      </Draggable.Wrapper>
      <Right ref={right} className={isMaximized() ? styles['maximized'] : ''}>
        <Window.Component
          isMaximized={isMaximized()}
          onMaximize={handleMaximize}
          isMenuOpened={isMenuOpened()}
          onMenuOpen={handleMenuOpen}
        >
          {children}
        </Window.Component>
      </Right>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Panel';

/** Returns a `Panel` component with default property values. */
export const WithDefaultComponent = Wrap.withDefaultProps(
  Component,
  DEFAULT_PROPS
);
