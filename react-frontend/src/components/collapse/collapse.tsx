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
import * as Props from './props';
import * as Misc from '../../utils/misc';
import * as Wrap from '../../utils/wrap';
import classnames from 'classnames';
import styles from '../../assets/styles/components/collapse.module.scss';

/** Default properties. */
const DEFAULT_PROPS = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange: (activeKey: string) => {
    /* Do nothing. */
  },
  accordion: false,
  destroyInactivePanel: false,
};

/** Returns the class name of the wrapper. */
const getClassName = (className: string): string =>
  classnames(styles['collapse'], {
    [className || '']: !!className,
  });

/** Returs active keys array according to a given React key. */
const getActiveKeysArray = (
  activeKey: React.Key | React.Key[]
): React.Key[] => {
  let keys = activeKey;
  if (!Array.isArray(keys))
    keys = typeof keys === 'number' || typeof keys === 'string' ? [keys] : [];
  return keys.map((key) => String(key));
};

/**
 * Returns a `Wrapper` component.
 * @param {Wrapper} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Wrapper> = ({
  className,
  style,
  children,
  onChange,
  motion,
  accordion,
  activeKey,
  defaultActiveKey,
  destroyInactivePanel,
  //expand,
  collapsible,
  ...divAttrs
}: Props.Wrapper): React.ReactElement => {
  /** @const Holds a state */
  const [activeKeys, setActiveKeys] = React.useState<React.Key[]>(
    getActiveKeysArray(activeKey ?? defaultActiveKey)
  );

  /** `getDerivedStateFromProps` */
  React.useEffect(() => {
    setActiveKeys(getActiveKeysArray(activeKey));
  }, [activeKey]);

  /** Clones child elements. Child elements are supposed to be {Panel} elements. */
  const cloneElement = (
    child: React.ReactElement,
    index: number
  ): React.ReactElement => {
    if (!child) return null;

    const key = child.key || String(index);
    let active = false;
    if (accordion) active = activeKeys[0] === key;
    else active = activeKeys.indexOf(key) > -1;

    if (typeof child.type === 'string') return child;
    else
      return React.cloneElement(child, {
        key: key,
        active: active,
        onClick:
          (child.props.collapsible ?? collapsible) === 'disabled'
            ? null
            : handleClick,
        panelKey: key,
        showArrow: true,
        collapsible: child.props.collapsible ?? collapsible,
        //icon
        accordion: accordion,
        //extra
        children: child.props.children,
        header: child.props.header,
        headerClassName: child.props.headerClassName,
        destroyInactivePanel:
          child.props.destroyInactivePanel ?? destroyInactivePanel,
        motion: motion,
        //destroy
        //expand: expand,
      });
  };

  /** Activates panels specified with a given active key array. */
  const activate = (keys: React.Key[]): void => {
    if (!activeKey) setActiveKeys(keys);
    onChange(accordion ? keys[0] : keys);
  };

  /** An event handler called on `onclick` events. */
  const handleClick = (key: React.Key): void => {
    let keys: React.Key[] = [];
    if (accordion) {
      keys = activeKeys[0] === key ? [] : [key];
    } else {
      keys = [...activeKeys];
      const index = keys.indexOf(key);
      const isActive = index > -1;
      if (isActive) keys.splice(index, 1);
      else keys.push(key);
    }
    activate(keys);
  };

  return (
    <div
      {...divAttrs}
      className={getClassName(className)}
      style={style}
      role={accordion ? 'tablist' : null}
    >
      {Misc.toArray(children).map(cloneElement)}
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Collapse';

/** Returns a `Drawer` component with default property values. */
export const WithDefaultComponent = Wrap.withDefaultProps(
  Component,
  DEFAULT_PROPS
);
