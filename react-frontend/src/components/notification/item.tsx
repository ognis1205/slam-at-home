/**
 * @fileoverview Defines Content component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import classnames from 'classnames';
import styles from '../../assets/styles/components/notification.module.scss';

/** Returns the class name of the notification. */
const getClassName = (
  className: string,
  level: string,
  iconClassName: string
): string =>
  classnames(styles['notification'], styles[`${level}`], {
    [className || '']: !!className,
    [iconClassName || '']: !!iconClassName,
  });

/** Returns the style of the notification. */
const getStyle = (color: string) =>
  'custom' && color ? { backgroundColor: color } : null;

/** Returns a `Item` component. */
export const Component: React.FunctionComponent<Props.Item> = ({
  className,
  level,
  title,
  message,
  ttl,
  iconClassName,
  color,
  showCloseButton,
  onClick,
  onHide,
  ...divAttrs
}: Props.Item): React.ReactElement => {
  /** @const Holds a motion effect. */
  const timeout = React.useRef<ReturnType<typeof setTimeout>>(null);

  /** `componentDidMount` */
  Hook.useDidMount(() => {
    if (ttl !== 0) timeout.current = setTimeout(handleHide, ttl);
  });

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    if (ttl !== 0) clearTimeout(timeout.current);
  });

  /** Event listener which is responsible for `onClick`. */
  const handleClick = (): void => {
    if (onClick) onClick();
    handleHide();
  };

  /** Event listener which is responsible for `onHide`. */
  const handleHide = (): void => {
    if (onHide) onHide();
  };

  /** Close button element. */
  const closeButton = showCloseButton ? (
    <span className={styles['close-button']} onClick={handleHide}>
      <i className={styles['close-icon']} />
    </span>
  ) : null;

  /** Title element. */
  const titleElement = title ? (
    <h4 className={styles['title']}>{title}</h4>
  ) : null;

  return (
    <div
      {...divAttrs}
      className={getClassName(className, level, iconClassName)}
      style={getStyle(color)}
    >
      {closeButton}
      <div onClick={handleClick}>
        {titleElement}
        <div className={styles['notification-message']} role="alert">
          <div className={styles['message']}>{message}</div>
        </div>
      </div>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'NotificationItem';
