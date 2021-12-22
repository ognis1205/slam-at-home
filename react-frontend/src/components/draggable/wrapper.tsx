/**
 * @fileoverview Defines Wrapper component.
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
import * as Draggable from './draggable';
import * as Props from './props';
import * as Hook from '../../utils/hook';
import * as Misc from '../../utils/misc';
import * as Position from '../../utils/position';
import classnames from 'classnames';
import styles from '../../assets/styles/components/draggable.module.scss';

/** Returns the class name of the wrapper. */
const getClassName = (
  className: string,
  isDragging: boolean,
  isDragged: boolean,
): string =>
  classnames(styles['draggable'], {
    [className || '']: !!className,
    [styles['dragging']]: isDragging,
    [styles['dragged']]: isDragged
  });

/** Returns the `transform` CSS property. */
const getTransform = (
  {x, y}: Position.Coord,
  offset: Position.CSSCoord,
  unit: string = 'px',
): string => {
  let translate = `translate(${x}${unit},${y}${unit})`;
  if (offset) {
    const dx = `${(typeof offset.x === 'string') ? offset.x : offset.x + unit}`;
    const dy = `${(typeof offset.y === 'string') ? offset.y : offset.y + unit}`;
    translate = `translate(${dx}, ${dy})` + translate;
  }
  return translate;
};

/** Scales dragging context. */
const Drag = (drag: Position.Drag, position: {x: number, y: number}, scale: number): Position.Drag => {
  return {
    target: drag.target,
    x: position.x + (drag.dx / scale),
    y: position.y + (drag.dy / scale),
    dx: (drag.dx / scale),
    dy: (drag.dy / scale),
    x0: position.x,
    y0: position.y
  };
};

/**
 * Returns a `Wrapper` component.
 * @param {Wrapper} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Wrapper> = (props: Props.Wrapper): React.ReactElement => {
  /** @const Holds a dragging state. */
  const [isDragging, setDragging] = React.useState<boolean>(false);

  /** @const Holds a dragging state. */
  const [isDragged, setDragged] = React.useState<boolean>(false);

  /** @const Holds a dragging position. */
  const [position, setPosition] = React.useState<{x: number; y: number}>({
    x: props.position.x || props.defaultPosition.x,
    y: props.position.y || props.defaultPosition.y,
  });

  /** @const Holds a compensating slack. */
  const [slack, setSlack] = React.useState<{x: number; y: number}>({
    x: 0,
    y: 0,
  });

  /** Holds a reference to the draggable fragment. */
  const component = React.useRef<HTMLElement>(null);

  /** Returns the DOM target element. */
  const getElement = (): HTMLElement => 
    component.current;

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    setDragging(false);
  });

  /** An event handler called on `start` events. */
  const handleStart = (e: MouseEvent, drag: Position.Drag): void | false => {
    if (props.onStart(e, Drag(drag, position, props.scale)) === false)
      return false;
    setDragging(true);
    setDragged(true);
  };

  /** An event handler called on `move` events. */
  const handleMove = (e: MouseEvent, drag: Position.Drag): void | false => {
    if (!isDragging)
      return false;

    const scaled = Drag(drag, position, props.scale);
    const newPosition = { x: scaled.x, y: scaled.y };
    const newSlack = { x: slack.x, y: slack.y };
    if (props.bounds) {
      const {x, y} = newPosition;
      newPosition.x += slack.x;
      newPosition.y += slack.y;
      const bound = Position.get(
        getElement(), 
        props.bounds, 
        newPosition.x, 
        newPosition.y
      );
      newPosition.x = bound.x;
      newPosition.y = bound.y;
      newSlack.x = slack.x + (x - newPosition.x);
      newSlack.y = slack.y + (y - newPosition.y);
      scaled.x = newPosition.x;
      scaled.y = newPosition.y;
      scaled.dx = newPosition.x - position.x;
      scaled.dy = newPosition.y - position.y;
    }

    if (props.onMove(e, scaled) === false)
      return false;
    setPosition(newPosition);
    setSlack(newSlack);
  };

  /** An event handler called on `stop` events. */
  const handleStop = (e: MouseEvent, drag: Position.Drag): void | false => {
    if (!isDragging)
      return false;

    if (props.onStop(e, Drag(drag, position, props.scale)) === false)
      return false;

    if (props.position)
      setPosition({ x: props.position.x, y: props.position.y });
    setDragging(false);
    setSlack({ x: 0, y: 0 });
  };

  return (
    <Draggable.Component
      ref={component}
      disabled={props.disabled}
      allowAnyClick={props.allowAnyClick}
      onStart={handleStart}
      onMove={handleMove}
      onStop={handleStop}
      onMouseDown={props.onMouseDown}
      grid={props.grid}
      handler={null}
      canceler={null}
    >
      {({onTouchEnd, onMouseDown, onMouseUp}, ref) => (
        Misc.toArray(props.children).map((child: React.ReactElement): React.ReactElement => {
          if (!child)
            return null;
          if (typeof child.type === 'string') {
            return child;
          } else {
            const {
              onTouchEnd: orgOnTouchEnd,
              onTouchDown: orgOnTouchDonw,
              onMouseUp: orgOnMouseUp,
              onMouseDown: orgOnMouseDown,
              className,
              ...rest
            } = child.props;
            return React.cloneElement(child, {
              onTouchEnd: onTouchEnd,
              onMouseDown: onMouseDown,
              onMouseUp: onMouseUp,
              className: getClassName(className, isDragging, isDragged),
              transform: getTransform({
                x: Position.canDragX(props.axis) && (!props.position || isDragging) ?
                   position.x :
                   (props.position || props.defaultPosition).x,
                y: Position.canDragY(props.axis) && (!props.position || isDragging) ?
                   position.y :
                   (props.position || props.defaultPosition).y
              }),
              ...rest,
            }, ref);
          }
        })
      )}
    </Draggable.Component>
  );
};

/** Sets the component's display name. */
Component.displayName = 'DraggableWrapper';
