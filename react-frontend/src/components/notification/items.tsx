/**
 * @fileoverview Defines Items component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Item from './item';
import * as Props from './props';
import * as Motion from '../motion';
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
const getClassName = (className: string, notifies: Props.Notify[]): string =>
  classnames(styles['notification-container'], {
    [className || '']: !!className,
    [styles['notification-container-empty']]: notifies.length === 0,
  });

/** Returns a `Item` component. */
export const Component: React.FunctionComponent<Props.Items> = ({
  className,
  notifies,
  duration,
  onHide,
  ...divAttrs
}: Props.Items): React.ReactElement => {
  /** Event listener which is responsible for `onHide`. */
  const handleHide = (notification: Props.Notify) => () => {
    if (onHide) {
      onHide(notification);
    }
  };

  return (
    <div {...divAttrs} className={getClassName(className, notifies)}>
      <Motion.List name="notification" deadline={duration}>
        {notifies.map((notify) => {
          return (
            <Item.Component
              key={notify.key}
              level={notify.level}
              title={notify.title}
              message={notify.message}
              ttl={notify.ttl}
              showCloseButton={notify.showCloseButton}
              onClick={notify.onClick}
              color={notify.color}
              iconClassName={notify.iconClassName}
              onRequestHide={handleHide(notify)}
            />
          );
        })}
      </Motion.List>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'NotificationItems';

/** Returns a `Items` component with default property values. */
export const WithDefaultComponent: React.FunctionComponent<Props.Items> =
  Wrap.withDefaultProps(Component, DEFAULT_PROPS);
