/**
 * @fileoverview Defines Wrapper component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Portal from './portal';
import * as Props from './props';
import * as Animation from '../../utils/animation';
import * as CSS from '../../utils/css';
import * as DOM from '../../utils/dom';
import * as Hook from '../../utils/hook';
import * as Scroll from '../../utils/scroll';

/** Counts opened portals. */
let openCount = 0;

/** A chached CSS `overflow`properties. */
let overflowCache = {};

/** Returns the container element of a portal wrapper. */
const getContainer = ({ container }: Props.Wrapper): HTMLElement => {
  const elems = DOM.select(container);
  return elems.length > 0 ? elems[0] : null;
};

/** @private Test usage only */
export const getOpenCount = (): number =>
  process.env.NODE_ENV === 'test' ? openCount : 0;

/** Returns a `Wrapper` component. */
export const Component: React.FunctionComponent<Props.Wrapper> = (
  props: Props.Wrapper
): React.ReactElement => {
  /** @const Holds a force updater. */
  const forceUpdate = Hook.useForceUpdate();

  /** @const Holds a previous container. */
  const prevContainer = Hook.usePrevious(props.container);

  /** @const Holds a reference to the container element. */
  const container = React.useRef<HTMLElement>(null);

  /** @const Holds a reference to the portal element. */
  const portal = React.useRef<Portal.Ref>(null);

  /** @const Holds a reference to the `requestAnimationFrame` identifier. */
  const animation = React.useRef<number>(null);

  /** @const Holds a reference to the scroll locker. */
  const scrollLocker = React.useRef<Scroll.Locker>(
    new Scroll.Locker({
      container: getContainer(props) as HTMLElement,
    })
  );

  /** `componentDidMount` */
  Hook.useDidMount(() => {
    updateOpenCount();
    setContainer();
    if (!hasContainer())
      animation.current = Animation.request(() => {
        forceUpdate();
      });
  });

  /** `componentDidUpdate` */
  Hook.useDidUpdate(() => {
    updateOpenCount();
    updateScrollLocker();
    setClassName();
    setContainer();
  });

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    if (DOM.isDefined() && getContainer(props) === document.body)
      openCount = props.visible && openCount ? openCount - 1 : openCount;
    removeContainer();
    Animation.clear(animation.current);
  });

  /** Updates a scroll locker. */
  const updateScrollLocker = React.useCallback((): void => {
    if (!props.visible) {
      scrollLocker.current?.unlock();
    } else if (
      props.visible &&
      DOM.isDefined() &&
      getContainer(props) !== scrollLocker.current?.getContainer()
    ) {
      scrollLocker.current?.relock({
        container: getContainer(props) as HTMLElement,
      });
    }
  }, [props]);

  /** Returns `true` if container has changed. */
  const isContainerDifferent = React.useCallback((): boolean => {
    const isFunction =
      typeof props.container === 'function' &&
      typeof prevContainer === 'function';
    return isFunction
      ? props.container.toString() !== prevContainer.toString()
      : props.container !== prevContainer;
  }, [props, prevContainer]);

  /** Updates open count. */
  const updateOpenCount = React.useCallback((): void => {
    if (DOM.isDefined() && getContainer(props) === document.body) {
      if (props.visible) openCount += 1;
      else openCount = openCount ? openCount - 1 : openCount;
    }
    if (isContainerDifferent()) removeContainer();
  }, [props, isContainerDifferent]);

  /** Sets a wrapper class name. */
  const setClassName = (): void => {
    if (
      props.container &&
      props.className &&
      container.current &&
      props.className !== container.current.className
    )
      container.current.className = props.className;
  };

  /** Returns `true` if the container is set already. */
  const hasContainer = (): boolean => !!container.current?.parentNode;

  /** Sets a container element. */
  const setContainer = (force = false): void => {
    if (force || (container.current && !container.current?.parentNode)) {
      const parent = getContainer(props);
      if (parent) parent.appendChild(container.current);
    }
  };

  /** Removes a container element. */
  const removeContainer = (): HTMLElement =>
    container.current?.parentNode?.removeChild(container.current);

  /** Returns a portal container. */
  const getPortal = (): HTMLElement => {
    if (!DOM.isDefined()) return null;
    if (!container.current) {
      container.current = document.createElement('div');
      setContainer(true);
    }
    setClassName();
    return container.current;
  };

  /** Holds a portal context. */
  const context: Props.WrapperContext = {
    container: getPortal,
    getOpenCount: () => openCount,
    scrollLocker: scrollLocker.current,
    switchScrollingEffect: () => {
      if (openCount === 1 && !Object.keys(overflowCache).length) {
        Scroll.switchEffect();
        overflowCache = CSS.set({
          overflow: 'hidden',
          overflowX: 'hidden',
          overflowY: 'hidden',
        });
      } else if (!openCount) {
        CSS.set(overflowCache);
        overflowCache = {};
        Scroll.switchEffect(true);
      }
    },
  } as Props.WrapperContext;

  if (props.forceRender || props.visible)
    return (
      <Portal.Component
        container={getPortal}
        ref={(el) => (portal.current = el)}
      >
        {typeof props.children === 'function'
          ? props.children(context)
          : props.children}
      </Portal.Component>
    );
  else return null;
};

/** Sets the component's display name. */
Component.displayName = 'PortalWrapper';
