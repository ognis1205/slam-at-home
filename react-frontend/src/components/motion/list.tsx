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
  'name',
  'appear',
  'enter',
  'exit',
  'exitImmediately',
  'deadline',
  'removeOnExit',
  'exitedClassName',
  'onAppearStart',
  'onAppearActive',
  'onAppearDone',
  'onEnterStart',
  'onEnterActive',
  'onEnterDone',
  'onExitStart',
  'onExitActive',
  'onExitDone',
];

/** Defines {List} components. */
export const Component: React.FunctionComponent<Props.List> = ({
  keys,
  onVisibleChanged,
  children,
  ...rest
}: Props.List): React.ReactElement => {
  /** @const Holds keys with status. */
  const [keyWithStatuses, setKeyWithStatuses] = React.useState<
    Key.WithStatus[]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

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

  // TODO: refactor this.
  MOTION_PROP_KEYS.forEach((key) => {
    if (rest[key]) {
      props[key] = rest[key];
      delete rest[key];
    }
  });

  return (
    <React.Fragment>
      {!!keyWithStatuses.length &&
        keyWithStatuses.map((entity) => {
          const visible =
            entity.status === Key.Status.ADD ||
            entity.status === Key.Status.KEEP;
          return (
            <Motion.Component
              {...props}
              key={entity.key}
              visible={visible}
              eventProps={entity}
              onVisibleChanged={(visible) => {
                onVisibleChanged?.(visible, { key: entity.key });
                if (!visible) {
                  remove(entity.key);
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
