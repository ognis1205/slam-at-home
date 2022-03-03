/**
 * @fileoverview Defines {List} component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import * as Motion from './motion';
import * as Key from '../../utils/key';

/** Target motion properties. */
const MOTION_PROP_KEYS = [
  'eventProps',
  'visible',
  'children',
  'motionName',
  'motionAppear',
  'motionEnter',
  'motionLeave',
  'motionLeaveImmediately',
  'motionDeadline',
  'removeOnLeave',
  'leavedClassName',
  'onAppearStart',
  'onAppearActive',
  'onAppearEnd',
  'onEnterStart',
  'onEnterActive',
  'onEnterEnd',
  'onLeaveStart',
  'onLeaveActive',
  'onLeaveEnd',
];

/** Defines {List} components. */
const Component: React.FunctionComponent<Props.List> = ({
  keys,
  onVisibleChanged,
  children,
  ...rest
}: Props.List): React.ReactElement => {
  /** @const Holds keys with status. */
  const [keyWithStatuses, setKeyWithStatuses] = React.useState<
    Props.KeyWithStatus[]
  >([]);

  /** `getDerivedStateFromProps` */
  React.useEffect(() => {
    const diff = Key.diff(keyWithStatuses, Key.parse(keys));
    setKeyWithStatuses(
      diff.filter((entity) => {
        const prev = keyWithStatuses.find(({ key }) => entity.key === key);
        if (
          prev &&
          prev.status === Key.Status.REMOVED &&
          entity.status === Key.Status.REMOVE
        ) {
          return false;
        }
        return true;
      })
    );
  }, [keys, keyWithStatuses]);

  /** Removes the specified key from the current state. */
  const remove = (key: React.Key): void => {
    setKeyWithStatuses((prev) =>
      prev.map((entity) => {
        if (entity.key !== key) return entity;
        return {
          ...entity,
          status: Key.Status.REMOVED,
        };
      })
    );
  };

  /** Holds motions properties. */
  const props: Props.Motion = {};

  MOTION_PROP_KEYS.forEach((key) => {
    props[key] = rest[key];
    delete rest[key];
  });

  return (
    <React.Fragment {...rest}>
      {keyWithStatuses.map(({ status, ...eventProps }) => {
        const visible = status === Key.Status.ADD || status === Key.Status.KEEP;
        return (
          <Motion.Component
            {...props}
            key={eventProps.key}
            visible={visible}
            eventProps={eventProps}
            onVisibleChanged={(visible) => {
              onVisibleChanged?.(visible, { key: eventProps.key });
              if (!visible) {
                remove(eventProps.key);
              }
            }}
          >
            {children}
          </Motion.Component>
        );
      })}
    </React.Fragment>
  );
};

/** Sets the component's display name. */
Component.displayName = 'MotionList';
