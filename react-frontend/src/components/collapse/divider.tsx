/**
 * @fileoverview Defines {Divider} component.
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
import styles from '../../assets/styles/components/collapse.module.scss';

/** Returns the class name of the wrapper. */
const getClassName = <T extends unknown>(
  {className, level}: Props.Divider<T>,
): string =>
  classnames(styles['divider'], styles[`level-${level}`], {
    [className || '']: !!className,
  });

/**
 * Returns a `Divider` component.
 * @param {Divider} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Divider<unknown>> = <T extends unknown>(
  props: Props.Divider<T>
): React.ReactElement => {
  /** Separates HTML attributes. */
  const {
    level,
    divider,
    className,
    style,
    ...htmlAttrs
  } = props;

  return (
    <div
      {...htmlAttrs}
      className={getClassName(props)}
      style={{
        ...style,
      }}
    >
      <span className={styles['content']}>{divider}</span>
    </div>
  )
};

/** Sets the component's display name. */
Component.displayName = 'CollapseDivider';