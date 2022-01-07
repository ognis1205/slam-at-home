/**
 * @fileoverview Defines Collapse Panel component.
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
import * as Motion from '../motion';
import classnames from 'classnames';
import styles from '../../assets/styles/components/collapse.module.scss';

/** Returns the class name of the header. */
const getHeaderClassName = ({ className, collapsible }: Props.Header): string =>
  classnames(styles['header'], {
    [className || '']: !!className,
    [styles['collapsible-only']]: collapsible,
  });

/**
 * Returns a `PanelHeader` component.
 * @param {Header} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
const Header: React.FunctionComponent<
  Props.Header & { children: React.ReactNode }
> = (
  props: Props.Header & { children: React.ReactNode }
): React.ReactElement => {
  /** An event handler called on `click` events. */
  const handleClick = (): void => props.onClick?.(props.panelKey);

  /** An event handler called on `keypress` events. */
  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') handleClick();
  };

  /** Holds arrow node. */
  let arrow: React.ReactNode = <i className={styles['arrow']} />;

  /** Holds header properties. */
  const headerProps: React.HTMLAttributes<HTMLDivElement> = {
    className: getHeaderClassName(props),
    onKeyPress: handleKeyPress,
    ['aria-expanded']: props.active,
  };

  if (props.showArrow && typeof props.arrow === 'function')
    arrow = props.arrow(props);

  if (props.collapsible) {
    arrow = (
      <span style={{ cursor: 'pointer' }} onClick={handleClick}>
        {arrow}
      </span>
    );
  } else {
    headerProps.onClick = handleClick;
    headerProps.role = props.accordion ? 'tab' : 'button';
    headerProps.tabIndex = props.collapsible === 'disabled' ? -1 : 0;
  }

  return (
    <div {...headerProps}>
      {props.icon && <span className={styles['icon']}>{props.icon}</span>}
      {props.collapsible ? (
        <span onClick={handleClick} className={styles['text']}>
          {props.children}
        </span>
      ) : (
        props.children
      )}
      {props.showArrow && arrow}
    </div>
  );
};

/** Sets the component's display name. */
Header.displayName = 'PanelHeader';

/** Returns the class name of the content. */
const getContentClassName = ({ className, active }: Props.Content): string =>
  classnames(styles['content'], {
    [className || '']: !!className,
    [styles['content-active']]: active,
    [styles['content-inactive']]: !active,
  });

/**
 * Returns a `PanelContent` component.
 * @param {Content} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
const Content = React.forwardRef<
  HTMLDivElement,
  Props.Content & { children: React.ReactNode }
>((props: Props.Content & { children: React.ReactNode }, ref) => {
  /** @const Holds a component's rendering state. */
  const [rendered, setRendered] = React.useState(
    props.active || props.forceRender
  );

  /** `getDerivedStateFromProps` */
  React.useEffect(() => {
    if (props.forceRender || props.active) setRendered(true);
  }, [props.forceRender, props.active]);

  return rendered ? (
    <div
      className={getContentClassName(props)}
      ref={ref}
      style={props.style}
      role={props.role}
    >
      <div className={styles['box']}>{props.children}</div>
    </div>
  ) : null;
});

/** Sets the component's display name. */
Content.displayName = 'PanelContent';

/** Returns the class name of the content. */
const getClassName = ({
  className,
  active,
  collapsible,
}: Props.Panel): string =>
  classnames(styles['panel'], {
    [className || '']: !!className,
    [styles['panel-active']]: active,
    [styles['panel-inactive']]: collapsible === 'disabled',
  });

/**
 * Returns a `Panel` component.
 * @param {Panel} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
export const Component: React.FunctionComponent<Props.Panel> = (
  props: Props.Panel
): React.ReactElement => (
  <div className={getClassName(props)} style={props.style} id={props.id}>
    <Header
      className={props.headerClassName}
      active={props.active}
      onClick={props.onClick}
      panelKey={props.panelKey}
      showArrow={props.showArrow}
      collapsible={props.collapsible}
      arrow={props.arrow}
      accordion={props.accordion}
      icon={props.icon}
    >
      {props.header}
    </Header>
    <Motion.Component
      visible={props.active}
      forceRender={props.forceRender}
      removeOnExit={props.destroyInactivePanel}
      exitedClassName={styles['hidden']}
      {...props.motion}
    >
      {({ className: motionClassName, style: motionStyle }, ref) => (
        <Content
          className={motionClassName}
          ref={ref}
          style={motionStyle}
          active={props.active}
          forceRender={props.forceRender}
          role={props.accordion ? 'tabpanel' : null}
        >
          {props.children}
        </Content>
      )}
    </Motion.Component>
  </div>
);

/** Sets the component's display name. */
Component.displayName = 'Panel';
