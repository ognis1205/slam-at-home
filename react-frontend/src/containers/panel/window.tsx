/**
 * @fileoverview Defines Window component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Button from './button';
import * as Menu from '../menu';
import * as Modal from '../../components/modal';
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

/** Returns a `Pager` component. */
export const Pager: React.FunctionComponent<Props.Pager> = ({
  children,
  ...divProps
}: Props.Pager): React.ReactElement => {
  return (
    <div className={styles['pager']} {...divProps}>
      {children}
    </div>
  );
};

/** Sets the component's display name. */
Pager.displayName = 'Pager';

/** Returns a `Window` component. */
export const Component: React.FunctionComponent<Props.Window> = ({
  children,
  isMaximized,
  onMaximize,
  isMenuOpened,
  onMenuOpen,
  ...divProps
}: Props.Window): React.ReactElement => {
  /** @const Holds a reference to the component itself. */
  const self = React.useRef<HTMLDivElement>(null);

  /** Event listener which is responsible for `onClick`. */
  const handleMaximize = (): void => {
    if (onMaximize) onMaximize();
  };

  /** Event listener which is responsible for `onClick`. */
  const handleMenuOpen = (): void => {
    if (onMenuOpen) onMenuOpen();
  };

  return (
    <div ref={self} className={styles['window']} {...divProps}>
      <Controller>
        <Button.Component
          className={styles['wifi']}
          icon={FontAwesomeIcon.faWifi}
        />
        <Modal.Component
          trigger={
            <Button.Component
              className={styles['menu']}
              icon={
                isMenuOpened
                  ? FontAwesomeIcon.faCaretSquareUp
                  : FontAwesomeIcon.faCaretSquareDown
              }
              onClick={handleMenuOpen}
            />
          }
          position={['right bottom']}
          on="click"
          offset={{ x: 8, y: 4 }}
          onOpen={handleMenuOpen}
          onClose={handleMenuOpen}
        >
          <Menu.Component />
        </Modal.Component>
        <Button.Component
          className={styles['maximize']}
          icon={
            isMaximized
              ? FontAwesomeIcon.faMinusSquare
              : FontAwesomeIcon.faPlusSquare
          }
          onClick={handleMaximize}
        />
      </Controller>
      <Pager>{children}</Pager>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Window';
