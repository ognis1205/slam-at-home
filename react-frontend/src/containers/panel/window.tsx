/**
 * @fileoverview Defines Window component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Button from './button';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import styles from '../../assets/styles/containers/panel.module.scss';

/** Returns a `Controller` component. */
export const Controller: React.FunctionComponent<Props.Controller> = ({
  children,
  ...divProps
}: Props.Controller): React.ReactElement => {
  return (
    <div className={styles['controller']} {...divProps}>
      {children}
    </div>
  );
};

/** Sets the component's display name. */
Controller.displayName = 'Controller';

/** Returns a `Window` component. */
export const Component: React.FunctionComponent<Props.Window> = ({
  children,
  isMaximized,
  onMaximize,
  onOpen,
  ...divProps
}: Props.Window): React.ReactElement => {
  /** @const Holds a reference to the component itself. */
  const self = React.useRef<HTMLDivElement>(null);

  /** Event listener which is responsible for `onClick`. */
  const handleMaximize = (): void => {
    if (onMaximize) onMaximize();
  };

  /** Event listener which is responsible for `onClick`. */
  const handleOpen = (): void => {
    if (onOpen) onOpen();
  };

  return (
    <div ref={self} className={styles['window']} {...divProps}>
      <Controller>
        <Button.Component
          className={styles['wifi']}
          icon={FontAwesomeIcon.faWifi}
        />
        <Button.Component
          className={styles['menu']}
          icon={FontAwesomeIcon.faChevronCircleDown}
          onClick={handleOpen}
        />
        <Button.Component
          className={styles['maximize']}
          icon={
            isMaximized
              ? FontAwesomeIcon.faMinusCircle
              : FontAwesomeIcon.faPlusCircle
          }
          onClick={handleMaximize}
        />
      </Controller>
      {children}
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Window';
