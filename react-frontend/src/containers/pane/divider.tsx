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
import classnames from 'classnames';
import styles from '../../assets/styles/containers/pane.module.scss';

/** Returns the class name of the wrapper. */
const getClassName = (className: string): string =>
  classnames(styles['divider'], {
    [className || '']: !!className,
  });

/**
 * Returns a `Div` component.
 * @return {ReactElement} A rendered React element.
 */
const Div: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>> = (
  {className, ...rest}: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement =>
  <div {...rest} className={getClassName(className)}>{null}</div>;

/**
 * Returns a `Divider` component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<any> = (): React.ReactElement =>
  <Draggable.Wrapper axis='x'><Div/></Draggable.Wrapper>;

/** Sets the component's display name. */
Component.displayName = 'Divider';
