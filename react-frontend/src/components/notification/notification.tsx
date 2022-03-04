/**
 * @fileoverview Defines Notification component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Items from './items';
import * as Props from './props';
import * as Hook from '../../utils/hook';
import * as Wrap from '../../utils/wrap';
import Manager from './manager';

/** Default properties. */
const DEFAULT_PROPS: Partial<Props.Notification> = {
  duration: 400,
};

/** Returns a `Notification` component. */
const Component: React.FunctionComponent<Props.Notification> = ({
  duration,
  ...divAttrs
}: Props.Notification): React.ReactElement => {
  /** @const Holds notifies. */
  const [notifies, setNotifies] = React.useState<Props.Notify[]>([]);

  /** `componentWillMount` */
  Hook.useWillMount(() => {
    Manager.addNotificationListener(handleNotify);
  });

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    Manager.removeNotificationListener(handleNotify);
  });

  /** An event handler called on `notify` events. */
  const handleNotify = (notifies: Props.Notify[]) => {
    setNotifies(notifies);
  };

  /** An event handler called on `onhide` events. */
  const handleHide = (notify: Props.Notify): void => {
    Manager.remove(notify);
  };

  return (
    <Items.WithDefaultComponent
      {...divAttrs}
      duration={duration}
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
