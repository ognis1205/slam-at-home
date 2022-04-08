/**
 * @fileoverview Defines Menu component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Props from './props';
import * as Popups from '../popups';
import * as Modal from '../../components/modal';
import * as Store from '../../redux/store';
import * as Signaling from '../../redux/modules/signaling';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as FontAwesomeCore from '@fortawesome/fontawesome-svg-core';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import * as FontAwesomeBrandIcon from '@fortawesome/free-brands-svg-icons';
import classnames from 'classnames';
import styles from '../../assets/styles/containers/menu.module.scss';

/** Returns the corresponding FontAwesome icon. */
const getIcon = (type: Props.ItemType): FontAwesomeCore.IconDefinition => {
  switch (type) {
    case Props.ItemType.SETTING:
      return FontAwesomeIcon.faCog;
    case Props.ItemType.GITHUB:
      return FontAwesomeBrandIcon.faGithub;
    case Props.ItemType.GITTER:
      return FontAwesomeBrandIcon.faGitter;
    case Props.ItemType.WIKI:
      return FontAwesomeIcon.faBookOpen;
    case Props.ItemType.SHARE:
      return FontAwesomeIcon.faShareSquare;
    case Props.ItemType.INFO:
    default:
      return FontAwesomeIcon.faInfoCircle;
  }
};

/** Returns the class name of the icon. */
const getIconClassName = (type: Props.ItemType): string =>
  classnames(styles['icon'], styles[type]);

/** Returns the class name of the content. */
const getClassName = (className: string): string =>
  classnames(styles['menu'], {
    [className || '']: !!className,
  });

/** Returns a `Container` component. */
const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...divProps }: React.HTMLAttributes<HTMLDivElement>, ref) => (
  <div ref={ref} {...divProps}>
    {children}
  </div>
));

/** Sets the component's display name. */
Container.displayName = 'Container';

/** Returns a `Divider` component. */
const Divider: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>> =
  ({
    ...divProps
  }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => (
    <div {...divProps} className={styles['divider']} />
  );

/** Sets the component's display name. */
Divider.displayName = 'Divider';

/** Returns a `ExternalLink` component. */
const ExternalLink: React.FunctionComponent<Props.ExternalLink> = ({
  type,
  title,
  ...aAttrs
}: Props.ExternalLink): React.ReactElement => (
  <div className={styles['item']}>
    <a className={styles['link']} {...aAttrs}>
      <span className={getIconClassName(type)}>
        <FontAwesome.FontAwesomeIcon icon={getIcon(type)} />
      </span>
      <span className={styles['title']}>{title}</span>
    </a>
  </div>
);

/** Sets the component's display name. */
ExternalLink.displayName = 'Externallink';

/** Returns a `Popups` component. */
export const Popup = React.forwardRef<HTMLDivElement, Props.Popup>(
  ({ type, title, ...divAttrs }: Props.Popup, ref): React.ReactElement => (
    <div ref={ref} className={styles['item']} {...divAttrs}>
      <span className={getIconClassName(type)}>
        <FontAwesome.FontAwesomeIcon icon={getIcon(type)} />
      </span>
      <span className={styles['title']}>{title}</span>
    </div>
  )
);

/** Sets the component's display name. */
Popup.displayName = 'Popup';

/** Returns a `Menu` component. */
export const Component = React.forwardRef<HTMLDivElement, Props.Menu>(
  (
    { className, ...rest }: Props.Menu,
    ref: React.ForwardedRef<HTMLDivElement>
  ): React.ReactElement => {
    /** @const Holds a Redux state of the signalings module. */
    const signalingsStore = ReactRedux.useSelector(
      (store: Store.Type) => store.signaling
    );

    /** @const Holds a Redux state of the p2p module. */
    const p2pStore = ReactRedux.useSelector((store: Store.Type) => store.p2p);

    /** @const Holds a reference to the about item. */
    const about = React.useRef<Modal.Trigger>(null);

    /** @const Holds a reference to the share item. */
    const share = React.useRef<Modal.Trigger>(null);

    /** @const Holds a reference to the settings item. */
    const settings = React.useRef<Modal.Trigger>(null);

    /** Event listener which is responsible for `onClose`. */
    const handleAboutClose = (): void => {
      about.current?.close();
    };

    /** Event listener which is responsible for `onClose`. */
    const handleShareClose = (): void => {
      share.current?.close();
    };

    /** Event listener which is responsible for `onClose`. */
    const handleSettingsClose = (): void => {
      settings.current?.close();
    };

    return (
      <Container {...rest} className={getClassName(className)} ref={ref}>
        <Modal.Component
          ref={settings}
          trigger={
            <Popup
              title="Settings"
              key="settings"
              type="setting"
              target="_blank"
            />
          }
          modal={true}
          position={['right bottom']}
          on="click"
          offset={{ x: 0, y: 0 }}
        >
          <Popups.Settings
            checked={signalingsStore.status !== Signaling.Status.DISCONNECTED}
            url={signalingsStore.url}
            devices={p2pStore.devices}
            onClose={handleSettingsClose}
          />
        </Modal.Component>
        <Divider />
        <ExternalLink
          title="Report a bug"
          key="bugreport"
          type="github"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/ognis1205/slam-at-home/issues"
        />
        <ExternalLink
          title="Get help"
          key="gethelp"
          type="gitter"
          target="_blank"
          rel="noreferrer"
        />
        <Modal.Component
          ref={share}
          trigger={
            <Popup
              title="Share this app"
              key="share"
              type="share"
              target="_blank"
            />
          }
          modal={true}
          position={['right bottom']}
          on="click"
          offset={{ x: 0, y: 0 }}
        >
          <Popups.Share onClose={handleShareClose} />
        </Modal.Component>
        <Divider />
        <Modal.Component
          ref={about}
          trigger={
            <Popup title="About" key="about" type="info" target="_blank" />
          }
          modal={true}
          position={['right bottom']}
          on="click"
          offset={{ x: 0, y: 0 }}
        >
          <Popups.About onClose={handleAboutClose} />
        </Modal.Component>
        <ExternalLink
          title="Wiki"
          key="wiki"
          type="wiki"
          target="_blank"
          rel="noreferrer"
        />
      </Container>
    );
  }
);

/** Sets the component's display name. */
Component.displayName = 'Menu';
