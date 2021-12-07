/**
 * @fileoverview Defines Drawer component.
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
import * as Content from './content';
import * as Props from './props';
import * as Portal from '../portal';
import * as Wrap from '../../utils/wrap';
import classnames from 'classnames';
import styles from '../../assets/styles/components/drawer.module.scss';

/** Default properties. */
const DEFAULT_PROPS: Partial<Props.Drawer> = {
  placement: 'left',
  container: 'body',
  defaultOpen: false,
  drawLevel: 'all',
  drawDuration: '.3s',
  drawEase: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
  onChange: () => {},
  afterVisibleChange: () => {},
  handler: (
    <div className={styles['handle']}>
      <i className={styles['icon']}/>
    </div>
  ),
  showMask: true,
  maskClosable: true,
  maskStyle: {},
  className: '',
  keyboard: true,
  forceRender: false,
  autoFocus: true,
};

/** Returns the class name of the wrapper. */
const getClassName = (
  {className}: Props.Drawer,
): string =>
  classnames({
    [className || '']: !!className,
  });

/**
 * Returns a `Drawer` component.
 * @param {Drawer} props Properties that defines a behaviour of this component.
 * @return {ReactElement} A rendered React element.
 */
const Component: React.FunctionComponent<Props.Drawer> = (props: Props.Drawer): React.ReactElement => {
  /** @const Holds a open state. */
  const [open, setOpen] = React.useState<boolean>(
    typeof props.open !== 'undefined'
    ? props.open
    : !!props.defaultOpen);

  /** @const Holds a reference to the component itself. */
  const self = React.useRef<HTMLDivElement>(null);

  /** `getDerivedStateFromProps` */
  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  /** An event handler called on 'clickevent' events. */
  const onHandleClick = (e: React.MouseEvent | React.KeyboardEvent): void => {
    if (props.onHandleClick)
      props.onHandleClick(e);
    if (typeof props.open === 'undefined')
      setOpen(!open);
  };

  /** An event handler called on 'clickevent' events. */
  const onClose = (e: React.MouseEvent | React.KeyboardEvent): void => {
    if (props.onClose)
      props.onClose(e);
    if (typeof props.open === 'undefined')
      setOpen(false);
  };

  /** Separates commom properties. */
  const {
    className,
    container,
    forceRender,
    ...commonProps
  } = props;

  if (!container)
    return (
      <div
        className={getClassName(props)}
        ref={(el) => self.current = el}
      >
        <Content.Component
          {...commonProps}
          open={open}
          container={() => self.current as HTMLElement}
          onClose={onClose}
          onHandleClick={onHandleClick}
        />
      </div>
    );
  else
    return (
      <Portal.Wrapper
        visible={open}
        forceRender={!!commonProps.handler || forceRender}
        container={container}
        className={getClassName(props)}
      >
        {({visible, afterClose, ...rest}: Props.Content) => (
          <Content.Component
            {...commonProps}
            {...rest}
            open={visible !== undefined ? visible : open}
            afterVisibleChange={
              afterClose !== undefined ? afterClose : commonProps.afterVisibleChange
            }
            onClose={onClose}
            onHandleClick={onHandleClick}
          />
        )}
      </Portal.Wrapper>
    );
};

/** Sets the component's display name. */
Component.displayName = 'Drawer';

/** Returns a `Drawer` component with default property values. */
export const WithDefaultComponent: React.FunctionComponent<Props.Drawer> = Wrap.withDefaultProps(
  Component, 
  DEFAULT_PROPS
);
