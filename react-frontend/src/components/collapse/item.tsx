/**
 * @fileoverview Defines {Item} component.
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
  {className, depth}: Props.Item<T>,
  open: boolean,
): string =>
  classnames(styles['item'], styles[`depth-${depth}`], {
    [styles['open']]: open,
    [className || '']: !!className,
  });

/**
 * Returns a `Item` component.
 * @param {Item} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Item<unknown>> = <T extends unknown>(
  props: Props.Item<T>
): React.ReactElement => {
  /** @const Holds a open state. */
  const [open, setOpen] = React.useState<boolean>(
    typeof props.open !== 'undefined'
    ? props.open
    : !!props.defaultOpen);

  /** Checks if the item is a leaf. */
  const isLeaf = (): boolean =>
    !props.children;

  /** An event handler called on 'clickevent' events. */
  const onClick = (e: React.MouseEvent | React.KeyboardEvent): void => {
    if (isLeaf() && props.onClick)
      props.onClick(props.value, props.options);
    if (!isLeaf() && typeof props.open === 'undefined')
      setOpen(!open);
  };

  /** Separates HTML attributes. */
  const {
    depth,
    item,
    open: openProp,
    defaultOpen,
    value,
    icon,
    options,
    onClick: onClickProp,
    children,
    className,
    ...htmlAttrs
  } = props;

  return (
    <div
      {...htmlAttrs}
      className={getClassName(props, open)}
    >
      <div
        className={styles['content']}
        onClick={onClick}
      >
        {icon}
        <span className={styles['item']}>{item}</span>
        {children && <span className={styles['arrow']}/>}
      </div>
      {children && <div className={styles['children']}>{children}
         {children}
       </div>}
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'CollapseItem';
