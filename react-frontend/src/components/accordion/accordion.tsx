/**
 * @fileoverview Defines {Accordion} component.
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
import * as Props from './props';
import classnames from 'classnames';
import styles from '../../assets/styles/components/accordion.module.scss';

/** Checks if a given item is `DividerJSON.` */
const isDivider = <T extends unknown>(
  item: Props.ItemJSON<T> | Props.DividerJSON<T>
): item is Props.DividerJSON<T> =>
  'divider' in item;

/**
 * Returns a `Accordion` component.
 * @param {Accordion} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Accordion<unknown>> = <T extends unknown>(
  props: Props.Accordion<T>
): React.ReactElement => {
  /** Renders a specified accordion item. */
  const render = (item: Props.ItemJSON<T> | Props.DividerJSON<T>, level: number): React.ReactElement => {
    if (isDivider(item))
      return <Divider.Component key={item.divider} divider={item.divider} level={level}/>
    return null;
  }

  /** Separates HTML attributes. */
  const {
    items,
    rtl,
    ...htmlAttrs
  } = props;

  return (
    <div {...htmlAttrs} className={classnames(
      styles['accordion'],
      {[styles['rtl']]: rtl}
    )}>
      {items?.map((item) =>
        render(item, 0)
      )}
    </div>
  )
};

/** Sets the component's display name. */
Component.displayName = 'Accordion';
