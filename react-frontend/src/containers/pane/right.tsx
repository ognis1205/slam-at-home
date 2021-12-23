/**
 * @fileoverview Defines Right component.
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
import classnames from 'classnames';
import styles from '../../assets/styles/containers/pane.module.scss';

/** Returns the class name of the wrapper. */
const getClassName = (className: string): string =>
  classnames({
    [className || '']: !!className,
  });

/**
 * Returns a `Right` component.
 * @param {Right} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Right> = (props: Props.Right): React.ReactElement =>
  <div id={styles['right']}>{props.children}</div>;

/** Sets the component's display name. */
Component.displayName = 'RightPane';
