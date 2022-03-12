/**
 * @fileoverview Defines Notification component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Items from './items';
import * as Manager from './manager';
import * as Props from './props';
import * as Hook from '../../utils/hook';
import * as Wrap from '../../utils/wrap';

/** Default properties. */
const DEFAULT_PROPS: Partial<Props.Notification> = {
  duration: 400,
};

/** Returns a `Notification` component. */
const Component: React.FunctionComponent<Props.Notification> = ({
  duration,
  motion,
  ...divAttrs
}: Props.Notification): React.ReactElement => {
  /** @const Holds notifies. */
  const [notifies, setNotifies] = React.useState<Props.Notify[]>([]);

  /** An event handler called on `notify` events. */
  const handleNotify = (newNotifies: Props.Notify[]): void => {
    setNotifies([...newNotifies]);
  };

  /** An event handler called on `onhide` events. */
  const handleHide = (notify: Props.Notify): void => {
    Manager.SHARED.remove(notify);
  };

  /** `componentWillMount` */
  Hook.useWillMount(() => {
    Manager.SHARED.addNotificationListener(handleNotify);
  });

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    Manager.SHARED.removeNotificationListener(handleNotify);
  });

  return (
    <Items.WithDefaultComponent
      {...divAttrs}
      duration={duration}
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
