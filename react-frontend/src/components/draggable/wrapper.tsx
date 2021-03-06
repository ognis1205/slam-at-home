/**
 * @fileoverview Defines Wrapper component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Draggable from './draggable';
import * as Props from './props';
import * as Hook from '../../utils/hook';
import * as Position from '../../utils/position';
import * as Wrap from '../../utils/wrap';
import classnames from 'classnames';
import styles from '../../assets/styles/components/draggable.module.scss';

/** Default properties. */
const DEFAULT_PROPS = {
  disabled: false,
  allowAnyClick: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStart: (e: MouseEvent, drag: Position.Drag) => {
    /* Do nothing. */
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove: (e: MouseEvent, drag: Position.Drag) => {
    /* Do nothing. */
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStop: (e: MouseEvent, drag: Position.Drag) => {
    /* Do nothing. */
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMouseDown: (e: MouseEvent) => {
    /* Do nothing. */
  },
  grid: null,
  axis: 'both',
  scale: 1,
  bounds: false,
  position: null,
  positionOffset: null,
  defaultPosition: { x: 0, y: 0 },
};

/** Returns the class name of the wrapper. */
const getClassName = (
  className: string,
  isDragging: boolean,
  isDragged: boolean
): string =>
  classnames(styles['draggable'], {
    [className || '']: !!className,
    [styles['dragging']]: isDragging,
    [styles['dragged']]: isDragged,
  });

/** Returns the `transform` CSS property. */
const getTransform = ({ x, y }: Position.CSSCoord): string =>
  `translate(${x}px,${y}px)`;

/** Returns a `Wrapper` component. */
const Component: React.FunctionComponent<Props.Wrapper> = (
  props: Props.Wrapper
): React.ReactElement => {
  /** @const Holds a dragging state. */
  const isDragging = React.useRef<boolean>(false);

  /** @const Holds a dragging state. */
  const isDragged = React.useRef<boolean>(false);

  /** @const Holds a dragging position. */
  const [position, setPosition] = React.useState<{ x: number; y: number }>({
    x: props.position?.x || props.defaultPosition?.x || 0,
    y: props.position?.y || props.defaultPosition?.y,
  });

  /** @const Holds a compensating slack. */
  const [slack, setSlack] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  /** Holds a reference to the draggable fragment. */
  const component = React.useRef<HTMLElement>(null);

  /** Returns `true` if the component is dragging. */
  const checkIfDragging = (): boolean => isDragging.current;

  /** Sets the dragging flag. */
  const setDragging = (flag: boolean): boolean => (isDragging.current = flag);

  /** Returns `true` if the component is dragged. */
  const checkIfDragged = (): boolean => isDragged.current;

  /** Sets the dragging flag. */
  const setDragged = (flag: boolean): boolean => (isDragged.current = flag);

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    setDragging(false);
  });

  /** An event handler called on `start` events. */
  const handleStart = (e: MouseEvent, drag: Position.Drag): void | false => {
    if (props.onStart(e, drag) === false) return false;
    setDragging(true);
    setDragged(true);
  };

  /** An event handler called on `move` events. */
  const handleMove = (e: MouseEvent, drag: Position.Drag): void | false => {
    if (!checkIfDragging()) return false;
    const newPosition = { x: drag.x, y: drag.y };
    const newSlack = { x: slack.x, y: slack.y };
    if (props.onMove(e, drag) === false) return false;
    setPosition(newPosition);
    setSlack(newSlack);
  };

  /** An event handler called on `stop` events. */
  const handleStop = (e: MouseEvent, drag: Position.Drag): void | false => {
    if (!checkIfDragging()) return false;
    if (props.onStop(e, drag) === false) return false;
    if (props.position)
      setPosition({ x: props.position.x, y: props.position.y });
    setDragging(false);
    setSlack({ x: 0, y: 0 });
  };

  const { className, style, ...rest } = props.children.props;

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
      {React.cloneElement(props.children, {
        className: getClassName(className, checkIfDragging(), checkIfDragged()),
        style: {
          ...style,
          transform: getTransform({
            x:
              Position.canDragX(props.axis) &&
              (!props.position || checkIfDragging())
                ? position.x
                : (props.position || props.defaultPosition).x,
            y:
              Position.canDragY(props.axis) &&
              (!props.position || checkIfDragging())
                ? position.y
                : (props.position || props.defaultPosition).y,
          }),
        },
        ...rest,
      })}
    </Draggable.Component>
  );
};

/** Sets the component's display name. */
Component.displayName = 'DraggableWrapper';

/** Returns a `Draggable` component with default property values. */
export const WithDefaultComponent = Wrap.withDefaultProps(
  Component,
  DEFAULT_PROPS
);
