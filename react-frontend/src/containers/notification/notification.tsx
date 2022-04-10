/**
 * @fileoverview Defines Notification component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Items from './items';
import * as Props from './props';
import * as NotificationMiddleware from '../../redux/middlewares/notification';
import * as NotificationModule from '../../redux/modules/notification';
import * as Hook from '../../utils/hook';
import * as Wrap from '../../utils/wrap';

/** Default properties. */
const DEFAULT_PROPS: Partial<Props.Notification> = {
  duration: 400,
  placement: 'right',
};

/** Returns a `Notification` component. */
const Component: React.FunctionComponent<Props.Notification> = ({
  duration,
  placement,
  motion,
  ...divAttrs
}: Props.Notification): React.ReactElement => {
  /** @const Holds Redux dispatcher. */
  const dispatch = ReactRedux.useDispatch();

  /** @const Holds notifies. */
  const [notifies, setNotifies] = React.useState<NotificationModule.Item[]>([]);

  /** An event handler called on `notify` events. */
  const handleNotify = (newNotifies: NotificationModule.Item[]): void => {
    setNotifies([...newNotifies]);
  };

  /** An event handler called on `onhide` events. */
  const handleHide = (notify: NotificationModule.Item): void => {
    dispatch(NotificationModule.remove(notify.key));
  };

  /** `componentWillMount` */
  Hook.useWillMount(() => {
    NotificationMiddleware.addNotificationListener(handleNotify);
  });

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    NotificationMiddleware.removeNotificationListener(handleNotify);
  });

  return (
    <Items.WithDefaultComponent
      {...divAttrs}
      duration={duration}
      placement={placement}
      motion={motion}
      notifies={notifies}
      onHide={handleHide}
    />
  );
};

/** Sets the component's display name. */
Component.displayName = 'Notification';

/** Returns a `Drawer` component with default property values. */
export const WithDefaultComponent: React.FunctionComponent<Props.Notification> =
  Wrap.withDefaultProps(Component, DEFAULT_PROPS);
