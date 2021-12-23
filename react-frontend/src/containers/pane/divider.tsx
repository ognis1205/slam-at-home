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
import * as Draggable from '../../components/draggable';
import * as DOM from '../../utils/dom';
import classnames from 'classnames';
import styles from '../../assets/styles/containers/pane.module.scss';

/** Returns the class name of the wrapper. */
const getClassName = (className: string): string =>
  classnames({
    [className || '']: !!className,
  });

/** Returns the container element of a drawer content. */
const getContainer = (container: DOM.Identifier): HTMLElement =>
  DOM.get(container);

/** Returns the sibling elements of a drawer content. */
const getSiblings = (container: DOM.Identifier): HTMLElement[] =>
  Array.prototype.slice.call(getContainer(container)?.parentNode?.children);

/**
 * Returns a `Div` component.
 * @return {ReactElement} A rendered React element.
 */
const Div = React.forwardRef<any, React.HTMLAttributes<HTMLDivElement>>((
  {className, ...rest}: React.HTMLAttributes<HTMLDivElement>,
  ref: any,
): React.ReactElement => {
  return <div {...rest} ref={ref} className={getClassName(className)}>{null}</div>;
});

/**
 * Returns a `Divider` component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<any> = (): React.ReactElement => {
  /** @const Holds a reference to the component itself. */
  const self = React.useRef<HTMLDivElement>(null);

  /** @const Holds a reference to the component itself. */
  const container = () => self.current as HTMLElement;

  return (
    <Draggable.Wrapper axis='x'>
      <Div id={styles['divider']} ref={self}/>
    </Draggable.Wrapper>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Divider';
