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
import styles from '../../assets/styles/components/draggable.module.scss';

/** TODO: Refactor this fragment into function component if possible. */
class DraggableFragment extends React.Component<{
  children: React.ReactElement;
}> {
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
  if (!document || !DOM.isDefined()) return;
  if (document.body) DOM.addClassName(document.body, styles['body']);
};

/** Starts draggable mode. */
const stop = (document: Document): void => {
  if (!document || !DOM.isDefined()) return;
  if (document.body) DOM.removeClassName(document.body, styles['body']);
  const selection = (document.defaultView || window).getSelection();
  if (selection && selection.type !== 'Caret') selection.removeAllRanges();
};

/**
 * Returns a `Draggable` component.
 * @param {Draggable} props Properties that defines a behaviour of this component.
 * @param {any} ref `ReactRef` object.
 * @return {ReactElement} A rendered React element.
 */
export const Component = React.forwardRef<unknown, Props.Draggable>(
  (props: Props.Draggable, ref: React.Ref<unknown>): React.ReactElement => {
    /** @const Holds the current touch event identifier state. */
    const [identifier, setIdentifier] = React.useState<number>(null);

    /** @const Holds a dragging state. */
    const isDragging = React.useRef<boolean>(false);

    /** @const Holds a dragging position. */
    const position = React.useRef<{ x0: number; y0: number }>({
      x0: NaN,
      y0: NaN,
    });

    /** @const Holds a mounted flag. */
    const hasMounted = React.useRef(false);

    /** Holds a reference to the react node, it may be a HTMLElement. */
    const node = React.useRef<unknown>(null);

    /** Holds a reference to the draggable fragment. */
    const fragment = React.useRef<DraggableFragment>(null);

    /** Holds a reference to the current events. */
    const events = React.useRef<Events>(EVENTS.MOUSE);

    /** Returns `true` if the component is dragging. */
    const checkIfDragging = (): boolean => isDragging.current;

    /** Sets the dragging flag. */
    const setDragging = (flag: boolean): boolean => (isDragging.current = flag);

    /** Returnss the current event position. */
    const getPosition = (): { x0: number; y0: number } => position.current;

    /** Returnss the current event position. */
    const getX = (): number => position.current.x0;

    /** Returnss the current event position. */
    const getY = (): number => position.current.y0;

    /** Sets the current event position. */
    const setPosition = (value: {
      x0: number;
      y0: number;
    }): {
      x0: number;
      y0: number;
    } => (position.current = value);

    /** Returns `true` if the component has mounted. */
    const isMounted = (): boolean => hasMounted.current;

    /** Returns the DOM target element. */
    const getElement = (): HTMLElement => {
      try {
        return node.current instanceof HTMLElement
          ? node.current
          : DOM.find<HTMLElement>(fragment.current);
      } catch (e) {
        return null;
      }
    };

    /** Forwards ref. */
    const setRef = React.useCallback((element: unknown) => {
      node.current = element;
      Ref.fill(ref, element);
    }, []);

    /** `componentDidMount` */
    Hook.useDidMount(() => {
      hasMounted.current = true;
      const target = getElement();
      if (target)
        Event.addListener(target, EVENTS.TOUCH.start, handleTouchStart, {
          passive: false,
        });
    });

    /** `componentWillUnmount` */
    Hook.useWillUnmount(() => {
      const target = getElement();
      if (target) {
        Event.removeListener(
          target.ownerDocument,
          EVENTS.MOUSE.move,
          handleMove
        );
        Event.removeListener(
          target.ownerDocument,
          EVENTS.TOUCH.move,
          handleMove
        );
        Event.removeListener(
          target.ownerDocument,
          EVENTS.MOUSE.stop,
          handleStop
        );
        Event.removeListener(
          target.ownerDocument,
          EVENTS.TOUCH.stop,
          handleStop
        );
        Event.removeListener(target, EVENTS.TOUCH.start, handleTouchStart, {
          passive: false,
        });
        stop(target.ownerDocument);
      }
    });

    /** An event handler called on `start` events. */
    const handleStart = (e: Event.MouseTouch): void => {
      props.onMouseDown(e);
      if (
        !props.allowAnyClick &&
        typeof e.button === 'number' &&
        e.button !== 0
      )
        return;

      const target = getElement();
      if (
        props.disabled ||
        !(e.target instanceof target.ownerDocument.defaultView.Node) ||
        (props.handler &&
          !DOM.matchRecursive(e.target, props.handler, target)) ||
        (props.canceler && DOM.matchRecursive(e.target, props.canceler, target))
      )
        return;

      if (e.type === 'touchstart') e.preventDefault();

      setIdentifier(Event.getTouchIdentifier(e));
      const { x, y } = Position.on(e, target, identifier) || {};
      if (
        !x ||
        !y ||
        props.onStart(e, Position.drag(target, getPosition(), x, y)) ===
          false ||
        !isMounted()
      )
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
      let { x, y } = Position.on(e, target, identifier) || {};
      if (!x || !y) return;
      if (Array.isArray(props.grid)) {
        let dx = x - getX(),
          dy = y - getY();
        [dx, dy] = Position.snapTo(props.grid, dx, dy);
        if (!dx && !dy) return;
        (x = getX() + dx), (y = getY() + dy);
      }

      if (
        props.onMove(e, Position.drag(target, getPosition(), x, y)) === false ||
        !isMounted()
      ) {
        try {
          handleStop(new MouseEvent('mouseup') as Event.MouseTouch);
        } catch (err) {
          const event = document.createEvent('MouseEvents') as Event.MouseTouch;
          event.initMouseEvent(
            'mouseup',
            true,
            true,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
          );
          handleStop(event);
        }
        return;
      }

      setPosition({ x0: x, y0: y });
    };

    /** An event handler called on `stop` events. */
    const handleStop = (e: Event.MouseTouch): void => {
      if (!checkIfDragging()) return;

      const target = getElement();
      const { x, y } = Position.on(e, target, identifier) || {};
      if (
        !x ||
        !y ||
        props.onStop(e, Position.drag(target, getPosition(), x, y)) === false ||
        !isMounted()
      )
        return;

      stop(target.ownerDocument);
      setDragging(false);
      Event.removeListener(
        target.ownerDocument,
        events.current.move,
        handleMove
      );
      Event.removeListener(
        target.ownerDocument,
        events.current.stop,
        handleStop
      );
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
      <DraggableFragment ref={fragment}>
        {React.cloneElement(
          React.Children.only(props.children),
          {
            onTouchEnd: handleTouchEnd,
            onMouseDown: handleMouseDown,
            onMouseUp: handleMouseUp,
          },
          setRef
        )}
      </DraggableFragment>
    );
  }
);

/** Sets the component's display name. */
Component.displayName = 'Draggable';
