/**
 * @fileoverview Defines Items component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Item from './item';
import * as Props from './props';
import * as Motion from '../../components/motion';
import * as Wrap from '../../utils/wrap';
import classnames from 'classnames';
import styles from '../../assets/styles/components/notification.module.scss';

/** Default properties. */
const DEFAULT_PROPS: Partial<Props.Items> = {
  notifies: [],
  onHide: () => {
    // Do nothing.
  },
  duration: 400,
};

/** Returns the class name of the notification. */
const getClassName = (className: string): string =>
  classnames(styles['notification'], {
    [className || '']: !!className,
  });

/** Returns a `Item` component. */
export const Component: React.FunctionComponent<Props.Items> = ({
  className,
  notifies,
  duration,
  onHide,
  motion,
  ...divAttrs
}: Props.Items): React.ReactElement => {
  /** Event listener which is responsible for `onHide`. */
  const handleHide = (notification: Props.Notify) => () => {
    if (onHide) {
      onHide(notification);
    }
  };

  return (
    <div {...divAttrs} className={getClassName(className)}>
      <Motion.List
        {...motion}
        keys={notifies}
        name="notification"
        deadline={duration}
      >
        {(notify) => {
          return (
            <Item.Component
              className={notify.className}
              key={notify.key}
              level={notify.level}
              title={notify.title}
              message={notify.message}
              ttl={notify.ttl}
              showCloseButton={notify.showCloseButton}
              onClick={notify.onClick}
              color={notify.color}
              icon={notify.icon}
              onHide={handleHide(notify)}
              style={notify.style}
            />
          );
        }}
      </Motion.List>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'NotificationItems';

/** Returns a `Items` component with default property values. */
export const WithDefaultComponent: React.FunctionComponent<Props.Items> =
  Wrap.withDefaultProps(Component, DEFAULT_PROPS);
