/**
 * @fileoverview Defines {Collapse} component.
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
import * as Divider from './divider';
import * as Item from './item';
import * as Props from './props';
import classnames from 'classnames';
import styles from '../../assets/styles/components/collapse.module.scss';

/** Returns the class name of the wrapper. */
const getClassName = <T extends unknown>(
  {className, rtl}: Props.Collapse<T>,
): string =>
  classnames(styles['collapse'], {
    [className || '']: !!className,
    [styles['rtl']]: rtl,
  });

/** Checks if a given item is `DividerJSON.` */
const isDivider = <T extends unknown>(
  item: Props.ItemJSON<T> | Props.DividerJSON
): item is Props.DividerJSON =>
  'divider' in item;

/** Checks if a given item is `ItemJSON.` */
const isItem = <T extends unknown>(
  item: Props.ItemJSON<T> | Props.DividerJSON
): item is Props.ItemJSON<T> =>
  'item' in item;

/**
 * Returns a `Collapse` component.
 * @param {Collapse} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Collapse<unknown>> = <T extends unknown>(
  props: Props.Collapse<T>
): React.ReactElement => {
  /** Renders a specified collapse item. */
  const render = (
    entry: Props.ItemJSON<T> | Props.DividerJSON,
    key: number,
    depth: number
  ): React.ReactElement => {
    if (isDivider(entry))
      return <Divider.Component key={key} divider={item.divider} depth={depth}/>;
    if (isItem(entry))
        return (
          <Item.Component key={key} item={item.item} depth={depth}>
            {item.children?.map((child, index) => render(child, index, depth + 1))}
          </Item.Component>
        );
    return null;
  }

  /** Separates HTML attributes. */
  const {
    items,
    rtl,
    className,
    ...htmlAttrs
  } = props;

  return (
    <div {...htmlAttrs} className={getClassName(props)}>
      {items.map((item, index) =>
        render(item, index, 0)
      )}
    </div>
  )
};

/** Sets the component's display name. */
Component.displayName = 'Collapse';
