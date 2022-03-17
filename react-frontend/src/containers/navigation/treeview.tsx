/**
 * @fileoverview Defines TreeView component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import * as Collapse from '../../components/collapse';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import NavigationMotion from '../../assets/motions/navigation';
import styles from '../../assets/styles/containers/navigation.module.scss';

/** Returns the corresponding FontAwesome icon. */
const getIcon = (type: Props.ItemType): FontAwesome.Props => {
  switch (type) {
    case Props.ItemType.APPLICATION:
      return FontAwesomeIcon.faAt;
    case Props.ItemType.DOCUMENT:
    default:
      return FontAwesomeIcon.faFile;
  }
};

/** Returns the class name of the icon. */
const getIconClassName = (type: Props.ItemType): string =>
  classnames(styles['icon'], styles[type]);

/** Returns a `Item` component. */
export const Item: React.FunctionComponent<Props.Item> = ({
  type,
  title,
  active,
  ...aAttrs
}: Props.Item): React.ReactElement => (
  <div className={styles['item']}>
    <a className={styles['link']} {...aAttrs}>
      <span className={getIconClassName(type)}>
        <FontAwesome.FontAwesomeIcon icon={getIcon(type)} />
      </span>
      <span className={styles['title']}>{title}</span>
    </a>
  </div>
);

/** Returns a `TreeView` component. */
export const Component: React.FunctionComponent<Props.TreeView> = (
  divProps: Props.TreeView
): React.ReactElement => {
  /** @const Holds accodrind state. */
  const [accordion] = React.useState<boolean>(false);

  /** @const Holds opening directory state. */
  const [activeKey, setActiveKey] = React.useState<string[] | string>([
    'slam@home',
    'streaming',
    'reconstruction',
  ]);

  /** An event handler called on `onchange` events. */
  const handleChange = (key: string): void => setActiveKey(key);

  /** Returns `true` if the specified key is active. */
  const isActive = (key: string): boolean => {
    if (typeof activeKey === 'string') return key === activeKey;
    return activeKey.includes(key);
  };

  /** @const readme menu */
  const Readme = <Item title="README" key="readme" type="document" />;

  /** @const streaming menu */
  const StreamingMenu = (
    <Collapse.Wrapper
      className={styles['item']}
      accordion={accordion}
      onChange={handleChange}
      activeKey={activeKey}
      motion={NavigationMotion}
    >
      <Collapse.Panel
        header="Streaming"
        key="streaming"
        iconClassName={styles['directory']}
        icon={
          isActive('streaming')
            ? FontAwesomeIcon.faFolderOpen
            : FontAwesomeIcon.faFolder
        }
      >
        <Item title="WebRTC" key="webrtc" type="application" />
      </Collapse.Panel>
    </Collapse.Wrapper>
  );

  /** @const reconstruction menu */
  const ReconstructionMenu = (
    <Collapse.Wrapper
      className={styles['item']}
      accordion={accordion}
      onChange={handleChange}
      activeKey={activeKey}
      motion={NavigationMotion}
    >
      <Collapse.Panel
        header="Reconstruction"
        key="reconstruction"
        iconClassName={styles['directory']}
        icon={
          isActive('reconstruction')
            ? FontAwesomeIcon.faFolderOpen
            : FontAwesomeIcon.faFolder
        }
      >
        <Item title="SLAM" key="SLAM" type="application" />
        <Item title="SfM" key="SfM" type="application" />
      </Collapse.Panel>
    </Collapse.Wrapper>
  );

  return (
    <div {...divProps} className={styles['tree']}>
      <Collapse.Wrapper
        accordion={accordion}
        onChange={handleChange}
        activeKey={activeKey}
        motion={NavigationMotion}
      >
        <Collapse.Panel
          header="SLAM@Home"
          key="slam@home"
          iconClassName={styles['directory']}
          icon={
            isActive('slam@home')
              ? FontAwesomeIcon.faFolderOpen
              : FontAwesomeIcon.faFolder
          }
        >
          {Readme}
          {StreamingMenu}
          {ReconstructionMenu}
        </Collapse.Panel>
      </Collapse.Wrapper>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'TreeView';
