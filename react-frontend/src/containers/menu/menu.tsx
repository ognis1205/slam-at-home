/**
 * @fileoverview Defines Menu component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Modal from '../../components/modal';
import * as Hook from '../../utils/hook';
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
      return FontAwesomeIcon.faBars;
    case Props.ItemType.GITHUB:
      return FontAwesomeBrandIcon.faGithub;
    case Props.ItemType.GITTER:
      return FontAwesomeBrandIcon.faGitter;
    case Props.ItemType.SHARE:
      return FontAwesomeIcon.faShareSquare;
    case Props.ItemType.INFO:
    default:
      return FontAwesomeIcon.faInfo;
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
export const Container: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = ({
  children,
  ...divProps
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => (
  <div {...divProps}>{children}</div>
);

/** Sets the component's display name. */
Container.displayName = 'Controller';

/** Returns a `Divider` component. */
export const Divider: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = ({
  ...divProps
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => (
  <div {...divProps} className={styles['divider']} />
);

/** Sets the component's display name. */
Container.displayName = 'Controller';

/** Returns a `ExternalLink` component. */
export const ExternalLink: React.FunctionComponent<Props.ExternalLink> = ({
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

/** Returns a `Menu` component. */
export const Component = React.forwardRef<Props.Trigger, Props.Menu>(
  (
    { className, ...rest }: Props.Menu,
    ref: React.ForwardedRef<Props.Trigger>
  ): React.ReactElement => {
    return (
      <Container
        {...rest}
        className={getClassName(className)}
        ref={ref}
      >
        <ExternalLink
          title="Settings"
          key="settings"
          type="setting"
          target="_blank"
        />
        <Divider />
        <ExternalLink
          title="Report a bug"
          key="bugreport"
          type="github"
          target="_blank"
          href="https://github.com/ognis1205/slam-at-home/issues"
        />
        <ExternalLink
          title="Get help"
          key="gethelp"
          type="gitter"
          target="_blank"
        />
        <ExternalLink
          title="Share this app"
          key="share"
          type="share"
          target="_blank"
        />
        <Divider />
        <ExternalLink
          title="About"
          key="about"
          type="info"
          target="_blank"
        />
      </Container>
    );
  }
);

/** Sets the component's display name. */
Component.displayName = 'Menu';
