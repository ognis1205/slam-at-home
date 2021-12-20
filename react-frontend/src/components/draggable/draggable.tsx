/**
 * @fileoverview Defines {Draggable} component.
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
import * as Position from '../../utils/position';
import * as Ref from '../../utils/ref';
import * as Wrap from '../../utils/wrap';
import styles from '../../assets/styles/components/draggable.module.scss';

/** TODO: Refactor this fragment into function component if possible. */
class Wrapper extends React.Component<{children: React.ReactNode}> {
  render() {
    return this.props.children;
  }
}

/** Simple abstraction for dragging events names. */
type Events = {
  start: string;
  move: string;
  stop: string;
};

/** Simple abstraction for dragging events names. */
const EVENTS = {
  TOUCH: { start: 'touchstart', move: 'touchmove', stop: 'touchend' } as Events,
  MOUSE: { start: 'mousedown', move: 'mousemove', stop: 'mouseup' } as Events,
};

/** Starts draggable mode. */
const start = (document: Document): void => {
  if (!document || !DOM.isDefined())
    return;
  if (document.body)
    DOM.addClassName(document.body, styles['draggable']);
};

/** Starts draggable mode. */
const stop = (document: Document): void => {
  if (!document || !DOM.isDefined())
    return;
  if (document.body)
    DOM.removeClassName(document.body, styles['draggable']);
  const selection = (document.defaultView || window).getSelection();
  if (selection && selection.type !== 'Caret')
    selection.removeAllRanges();
};


/** Default properties. */
const DEFAULT_PROPS: Partial<Props.Draggable> = {
  disabled: false,
  onStart: (event: MouseEvent, drag: Position.Drag) => {},
  onMove: (event: MouseEvent, drag: Position.Drag) => {},
  onStop: (event: MouseEvent, drag: Position.Drag) => {},
};

/**
 * Returns a `Draggable` component.
 * @param {Draggable} props Properties that defines a behaviour of this component.
 * @param {any} ref `ReactRef` object.
 * @return {ReactElement} A rendered React element.
 */
const Fragment = React.forwardRef<any, Props.Draggable>(({
  disabled,
  allowAnyClick,
  onStart,
  onMove,
  onStop,
  onMouseDown,
  grid,
  handler,
  canceler,
  children,
}: Props.Draggable,
  ref: any
): React.ReactElement => {
  /** @const Holds the current touch event identifier state. */
  const [identifier, setIdentifier] = Hook.useMountedState<number>(null);

  /** @const Holds an async visibility state. */
  const [isDragging, setDragging] = Hook.useMountedState<boolean>(false);

  /** @const Holds a dragging position. */
  const [position, setPosition] = React.useState<{x0: number; y0: number}>({x0: NaN, y0: NaN});

  /** @const Holds a mounted flag. */
  const hasMounted = React.useRef(false);

  /** Holds a reference to the react node, it may be a HTMLElement. */
  const node = React.useRef<any>(null);

  /** Holds a reference to the wrapper fragment. */
  const wrapper = React.useRef<Wrapper>(null);

  /** Holds a reference to the current events. */
  const events = React.useRef<Events>(EVENTS.MOUSE);

  /** Returns `true` if the component has mounted. */
  const isMounted = (): boolean =>
    hasMounted.current;

  /** Returns the DOM target element. */
  const getElement = (): HTMLElement => {
    try {
      return node.current instanceof HTMLElement
           ? node.current
           : DOM.find<HTMLElement>(wrapper.current);
    } catch (e) {
      return null;
    }
  };

  /** Forwards ref. */
  const setRef = React.useCallback((element: any) => {
    node.current = element;
    Ref.fill(ref, element);
  }, []);

  /** `componentDidMount` */
  Hook.useDidMount(() => {
    hasMounted.current = true;
    const target = getElement();
    if (target)
      Event.addListener(target, EVENTS.TOUCH.start, handleTouchStart, { passive: false });
  });

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
   const target = getElement();
    if (target) {
      Event.removeListener(target.ownerDocument, EVENTS.MOUSE.move, handleMove);
      Event.removeListener(target.ownerDocument, EVENTS.TOUCH.move, handleMove);
      Event.removeListener(target.ownerDocument, EVENTS.MOUSE.stop, handleStop);
      Event.removeListener(target.ownerDocument, EVENTS.TOUCH.stop, handleStop);
      Event.removeListener(target, EVENTS.TOUCH.start, handleTouchStart, {passive: false});
      stop(target.ownerDocument);
    }
  });

  /** An event handler called on `start` events. */
  const handleStart = (e: Event.MouseTouch): void => {
    onMouseDown(e);
    if (!allowAnyClick && typeof e.button === 'number' && e.button !== 0)
      return;

    const target = getElement();
    if (disabled ||
        (!(e.target instanceof target.ownerDocument.defaultView.Node)) ||
        (handler && !DOM.matchRecursive(e.target, handler, target)) ||
        (canceler && DOM.matchRecursive(e.target, canceler, target)))
      return;

    if (e.type === 'touchstart')
      e.preventDefault();

    setIdentifier(Event.getTouchIdentifier(e));
    const {x, y} = Position.on(e, target, identifier) || {};
    if ((!x || !y) ||
        onStart(e, Position.drag(target, position, x, y)) === false ||
        !isMounted())
      return;

    start(target.ownerDocument);
    setDragging(true);
    setPosition({ x0: x, y0: y });
    Event.addListener(target.ownerDocument, events.current.move, handleMove);
    Event.addListener(target.ownerDocument, events.current.stop, handleStop);
  };

  /** An event handler called on `move` events. */
  const handleMove = (e: Event.MouseTouch): void => {
    const target = getElement();
    let {x, y} = Position.on(e, target, identifier) || {};
    if (!x || !y)
      return;
    if (Array.isArray(grid)) {
      let dx = x - position.x0, dy = y - position.y0;
      [dx, dy] = Position.snapTo(grid, dx, dy);
      if (!dx && !dy)
        return;
      x = position.x0 + dx, y = position.y0 + dy;
    }

    if (onMove(e, Position.drag(target, position, x, y)) === false ||
        !isMounted()) {
      try {
        handleStop(new MouseEvent('mouseup') as Event.MouseTouch);
      } catch (err) {
        const event = ((document.createEvent('MouseEvents') as any) as Event.MouseTouch);
        event.initMouseEvent('mouseup', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        handleStop(event);
      }
      return;
    }

    setPosition({ x0: x, y0: y });
  };

  /** An event handler called on `stop` events. */
  const handleStop = (e: Event.MouseTouch): void => {
    if (!isDragging) 
      return;

    const target = getElement();
    const {x, y} = Position.on(e, target, identifier) || {};
    if ((!x || !y) ||
        onStop(e, Position.drag(target, position, x, y)) === false ||
        !isMounted())
      return;

    stop(target.ownerDocument);
    setDragging(false);
    setPosition({ x0: NaN, y0: NaN });
    Event.removeListener(target.ownerDocument, events.current.move, handleMove);
    Event.removeListener(target.ownerDocument, events.current.stop, handleStop);
  };

  /** An event handler called on `touch` events. */
  const handleTouchStart = (e: Event.MouseTouch): void => {
    events.current = EVENTS.TOUCH;
    handleStart(e);
  };

  /** An event handler called on `touch` events. */
  const handleTouchEnd = (e: Event.MouseTouch): void => {
    events.current = EVENTS.TOUCH;
    handleStop(e);
  };

  /** An event handler called on `mouse` events. */
  const handleMouseDown = (e: Event.MouseTouch): void => {
    events.current = EVENTS.MOUSE;
    handleStart(e);
  };

  /** An event handler called on `mouse` events. */
  const handleMouseUp = (e: Event.MouseTouch): void => {
    events.current = EVENTS.MOUSE;
    handleStop(e);
  };

  return (
    <Wrapper ref={wrapper}>
      {children(
        { onTouchEnd: handleTouchEnd, onMouseDown: handleMouseDown, onMouseUp: handleMouseUp }, 
        setRef,
      )}
    </Wrapper>
  );
});

/** Sets the component's display name. */
Fragment.displayName = 'DraggableFragment';

/** Returns a `Draggable` component with default property values. */
export const WithDefaultFragment: React.FunctionComponent<Props.Draggable> = Wrap.withDefaultProps(
  Fragment, 
  DEFAULT_PROPS
);
