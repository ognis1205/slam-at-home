/**
 * @fileoverview Defines Window component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Props from './props';
import * as Button from './button';
import * as Menu from '../menu';
import * as Modal from '../../components/modal';
import * as Store from '../../redux/store';
import * as Signaling from '../../redux/modules/signaling';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
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

/** Returns the class name of the toggle. */
const getMenuClassName = (isOpen: boolean): string =>
  classnames(styles['menu'], {
    [styles['open'] || '']: isOpen,
  });

/** Returns the class name of the toggle. */
const getWifiClassName = (isConnected: boolean): string =>
  classnames(styles['wifi'], {
    [styles['connected'] || '']: isConnected,
  });

/** Returns a `Window` component. */
export const Component: React.FunctionComponent<Props.Window> = ({
  children,
  isMaximized,
  onMaximize,
  isMenuOpened,
  onMenuOpen,
  ...divProps
}: Props.Window): React.ReactElement => {
  /** @const Holds a Redux state of the signaling module. */
  const signalingStore = ReactRedux.useSelector(
    (store: Store.Type) => store.signaling
  );

  /** @const Holds a reference to the component itself. */
  const self = React.useRef<HTMLDivElement>(null);

  /** @const Holds a state of menu. */
  const [isOpen, setOpen] = React.useState<boolean>(false);

  /** Event listener which is responsible for `onClick`. */
  const handleMaximize = (): void => {
    if (onMaximize) onMaximize();
  };

  /** Event listener which is responsible for `onClick`. */
  const handleMenuOpen = (): void => {
    setOpen((open) => !open);
    if (onMenuOpen) onMenuOpen();
  };

  return (
    <div ref={self} className={styles['window']} {...divProps}>
      <Controller>
        <Button.Component
          className={getWifiClassName(
            signalingStore.status !== Signaling.Status.DISCONNECTED
          )}
          icon={FontAwesomeIcon.faWifi}
        />
        {
          <span className={styles['status']}>
            {signalingStore.url
              ? `Signaling (${signalingStore.url})`
              : 'No Signal'}
            &nbsp;/&nbsp;
            {signalingStore.remoteId
              ? `Camera (${signalingStore.remoteId})`
              : 'No Device'}
          </span>
        }
        <Modal.Component
          trigger={
            <Button.Component
              className={getMenuClassName(isOpen)}
              icon={
                isMenuOpened
                  ? FontAwesomeIcon.faChevronCircleUp
                  : FontAwesomeIcon.faChevronCircleDown
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
              ? FontAwesomeIcon.faMinusCircle
              : FontAwesomeIcon.faPlusCircle
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
