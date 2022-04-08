/**
 * @fileoverview Defines Items component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Item from './item';
import * as Props from './props';
import * as Motion from '../../components/motion';
import * as Reducks from '../../redux/modules/notification';
import * as Wrap from '../../utils/wrap';
import * as FontAwesomeCore from '@fortawesome/fontawesome-svg-core';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import styles from '../../assets/styles/containers/notification.module.scss';

/** Default properties. */
const DEFAULT_PROPS: Partial<Props.Items> = {
  notifies: [],
  onHide: () => {
    // Do nothing.
  },
  duration: 400,
  placement: 'right',
};

/** Returns the class name of the notification. */
const getClassName = (className: string, placement: Props.Placement): string =>
  classnames(styles['notification'], styles[placement], {
    [className || '']: !!className,
  });

/** Returns the corresponding FontAwesome icon. */
const getIcon = (level: Reducks.Level): FontAwesomeCore.IconDefinition => {
  switch (level) {
    case Reducks.Level.INFO:
      return FontAwesomeIcon.faInfoCircle;
    case Reducks.Level.SUCCESS:
      return FontAwesomeIcon.faCheckCircle;
    case Reducks.Level.WARNING:
      return FontAwesomeIcon.faExclamationCircle;
    case Reducks.Level.ERROR:
      return FontAwesomeIcon.faExclamationCircle;
    case Reducks.Level.CUSTOM:
    default:
      return FontAwesomeIcon.faInfoCircle;
  }
};

/** Returns a `Item` component. */
export const Component: React.FunctionComponent<Props.Items> = ({
  className,
  notifies,
  duration,
  onHide,
  placement,
  motion,
  ...divAttrs
}: Props.Items): React.ReactElement => {
  /** Event listener which is responsible for `onHide`. */
  const handleHide = (notification: Reducks.Item) => () => {
    if (onHide) onHide(notification);
  };

  return (
    <div {...divAttrs} className={getClassName(className, placement)}>
      <Motion.List
        {...motion}
        keys={notifies}
        name="notification"
        deadline={duration}
      >
        {({ className, style, ...notify }: Motion.Context) => {
          return (
            <Item.Component
              className={className}
              style={style}
              level={(notify as Props.Item).level}
              title={(notify as Props.Item).title}
              message={(notify as Props.Item).message}
              ttl={(notify as Props.Item).ttl}
              showCloseButton={(notify as Props.Item).showCloseButton}
              onClick={(notify as Props.Item).onClick}
              icon={getIcon((notify as Props.Item).level)}
              onHide={handleHide(notify as Reducks.Item)}
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
