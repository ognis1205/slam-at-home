/**
 * @fileoverview Defines Divider component.
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
import * as Draggable from '../../components/draggable';
import * as DOM from '../../utils/dom';
import * as Hook from '../../utils/hook';
import * as Misc from '../../utils/misc';
import * as Position from '../../utils/position';
import * as Wrap from '../../utils/wrap';
import classnames from 'classnames';
import styles from '../../assets/styles/containers/pane.module.scss';

/** Default properties. */
const DEFAULT_PROPS: Partial<Props.Divider> = {
  axis: 'x',
  defaultPosition: {x: 200, y: 0},
  leftmost: 200,
  rightmost: 200,
};

/** Returns the class name of the wrapper. */
const getClassName = (className: string): string =>
  classnames({
    [className || '']: !!className,
  });

/**
 * Returns a `Div` component.
 * @return {ReactElement} A rendered React element.
 */
const Div = React.forwardRef<any, React.HTMLAttributes<HTMLDivElement>>((
  {className, ...rest}: React.HTMLAttributes<HTMLDivElement>,
  ref: any,
): React.ReactElement =>
  <div {...rest} ref={ref} className={getClassName(className)}>{null}</div>
);

/**
 * Returns a `Divider` component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Divider> = (props: Props.Divider): React.ReactElement => {
  /** @const Holds a dragging position. */
  const [position, setPosition] = React.useState<{x: number; y: number}>({
    x: props.position?.x || props.defaultPosition?.x || 0,
    y: props.position?.y || props.defaultPosition?.y || 0,
  });

  /** @const Holds a reference to the component itself. */
  const self = React.useRef<HTMLDivElement>(null);

  /** @const Holds a mounted flag. */
  const hasMounted = React.useRef(false);

  /** @const Holds panes other than a divider. */
  const panes = React.useRef<{l: HTMLElement, r: HTMLElement}>({
    l: undefined,
    r: undefined,
  });

  /** Returns `true` if the component has mounted. */
  const isMounted = (): boolean =>
    hasMounted.current;

  /** Returns the left pane. */
  const getPanes = (): [HTMLElement, HTMLElement] => 
    [panes.current?.l, panes.current?.r];

  /** @const Holds a dragging state. */
  const isDragging = React.useRef<boolean>(false);

  /** Returns `true` if the component is dragging. */
  const checkIfDragging = (): boolean => 
    isDragging.current;

  /** Sets the dragging flag. */
  const setDragging = (flag: boolean): boolean => 
    isDragging.current = flag;

  /**  */
  React.useEffect(() => {
    if (isMounted())
      resize();
  }, [position]);

  /** `componentDidMount` */
  Hook.useDidMount(() => {
    hasMounted.current = true;
    init();
  });

  /** Inits drawer item HTML elements. */
  const init = (): void => {
    if (!DOM.isDefined())
      return;
    panes.current = {
      l: DOM.get(styles['left']),
      r: DOM.get(styles['right']),
    };
    resize();
  };

  /** Sets a CSS style on panes. */
  const resize = (): void => {
    const [left, right] = getPanes();
    const [width,] = DOM.getWindowSize();
    left.style.width = `${position.x}px`;
    right.style.left = `${position.x + 10}px`
    right.style.width = `${width - position.x - 10}px`
  };

  /** An event handler called on `start` events. */
  const handleStart = (e: MouseEvent, drag: Position.Drag): void | false => {
    const [width,] = DOM.getWindowSize();
    if (drag.x < props.leftmost || drag.x > width - props.rightmost)
      return false;
    setDragging(true);
  };

  /** An event handler called on `move` events. */
  const handleMove = (e: MouseEvent, drag: Position.Drag): void | false => {
    const [width,] = DOM.getWindowSize();
    if (!checkIfDragging() || drag.x < props.leftmost || drag.x > width - props.rightmost)
      return false;
    const newPosition = { x: drag.x, y: drag.y };
    setPosition(newPosition);
  };

  /** An event handler called on `stop` events. */
  const handleStop = (e: MouseEvent, drag: Position.Drag): void | false => {
    setDragging(false);
  };

  return (
    <Draggable.Wrapper
      axis={props.axis}
      defaultPosition={props.defaultPosition}
      onStart={handleStart}
      onMove={handleMove}
      onStop={handleStop}
    >
      <Div id={styles['divider']} ref={self}/>
    </Draggable.Wrapper>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Divider';

/** Returns a `Draggable` component with default property values. */
export const WithDefaultComponent: React.FunctionComponent<Props.Divider> = Wrap.withDefaultProps(
  Component, 
  DEFAULT_PROPS
);