/**
 * @fileoverview Defines Provider component.
 */
import * as React from 'react';
import * as Consumer from './consumer';
import * as Props from './props';
import * as RAF from '../../utils/animation';
import * as CSS from '../../utils/css';
import * as DOM from '../../utils/dom';
import * as Hook from '../../utils/hook';
import * as Scroll from '../../utils/scroll';

/** Counts opened portals. */
let openCount: number = 0;

/** A chached CSS `overflow`properties. */
let cachedOverflow: object = {};

/** Returns the container element of a portal provider. */
const getParent = ({container}: Props.Provider): HTMLElement => {
  const elems = DOM.select(container);
  return elems.length > 0 ? elems[0] : null;
};

/** @private Test usage only */
export const getOpenCount = (): number => {
  return process.env.NODE_ENV === 'test' ? openCount : 0;
}

/**
 * Returns a `Provider` component.
 * @param {Provider} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Provider> = (props: Props.Provider): React.ReactElement => {
  /** @const Holds a force updater. */
  const forceUpdate = Hook.useForceUpdate();

  /** @const Holds a reference to the container element. */
  const container = React.useRef<HTMLElement>(null);

  /** @const Holds a reference to the consumer element. */
  const consumer = React.useRef<Consumer.Ref>(null);

  /** @const Holds a reference to the `requestAnimationFrame` identifier. */
  const raf = React.useRef<number>(null);

  /** @const Holds a reference to the scroll locker. */
  const scrollLocker = React.useRef<Scroll.Locker>(new Scroll.Locker({
    container: getParent(props) as HTMLElement,
  }));

  /** `componentDidMount` */
  Hook.useDidMount(() => {
    updateOpenCount();
    setContainer();
    if (!hasContainer())
      raf.current = RAF.submit(() => {
        forceUpdate();
      });
  });

  /** `componentDidUpdate` */
  Hook.useDidUpdate(() => {
    updateOpenCount();
    updateScrollLocker();
    setWrapperClass();
    setContainer();
  });

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    if (DOM.isDefined() && getParent(props) === document.body)
      openCount = props.visible && openCount ? openCount - 1 : openCount;
    removeContainer();
    RAF.cancel(raf.current);
  });

  /** Updates a scroll locker. */
  const updateScrollLocker = React.useCallback((): void => {
    if (props.visible &&
        DOM.isDefined() &&
        getParent(props) !== scrollLocker.current?.getContainer())
      scrollLocker.current?.relock({
        container: getParent(props) as HTMLElement,
      });
  }, [props.visible]);

  /** Updates open count. */
  const updateOpenCount = React.useCallback((): void => {
    if (DOM.isDefined() &&
        getParent(props) === document.body) {
      if (props.visible)
        openCount += 1;
      else
        openCount = openCount ? openCount - 1 : openCount;
    }
    removeContainer();
  }, [props.visible, props.container]);

  /** Sets a wrapper class name. */
  const setWrapperClass = (): void => {
    if (props.container &&
        props.wrapperClass &&
        container.current &&
        props.wrapperClass !== container.current.className)
      container.current.className = props.wrapperClass;
  };

  /** Returns `true` if the container is set already. */
  const hasContainer = (): boolean =>
    !!container.current?.parentNode;

  /** Sets a container element. */
  const setContainer = (force: boolean = false): void => {
    if (force || (container.current && !container.current?.parentNode)) {
      const parent = getParent(props);
      if (parent)
        parent.appendChild(container.current);
    }
  };

  /** Removes a container element. */
  const removeContainer = (): void => {
    container.current?.parentNode?.removeChild(container.current);
  };

  /** Returns a portal container. */
  const getPortal = (): HTMLElement => {
    if (!DOM.isDefined())
      return null;
    if (!container.current) {
      container.current = document.createElement('div');
      setContainer(true);
    }
    setWrapperClass();
    return container.current;
  };

  /** Holds a portal context. */
  const context: Props.Context = {
    container: getPortal,
    getOpenCount: () => openCount,
    scrollLocker: scrollLocker.current,
    switchScrollingEffect: () => {
      if (openCount === 1 && !Object.keys(cachedOverflow).length) {
        Scroll.switchEffect();
        cachedOverflow = CSS.set({
          overflow: 'hidden',
          overflowX: 'hidden',
          overflowY: 'hidden',
        });
      } else if (!openCount) {
        CSS.set(cachedOverflow);
        cachedOverflow = {};
        Scroll.switchEffect(true);
      }
    },
  } as Props.Context;

  if (props.forceRender || props.visible || consumer.current)
    return (
      <Consumer.Component container={getPortal} ref={consumer}>
        {props.children(context)}
      </Consumer.Component>
    );
  else
    return null;
};
