/**
 * @fileoverview Defines TreeView component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import * as Collapse from '../../components/collapse';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import * as FontAwesomeBrandIcon from '@fortawesome/free-brands-svg-icons';
import * as Context from './context';
import classnames from 'classnames';
import NavigationMotion from '../../assets/motions/navigation';
import styles from '../../assets/styles/containers/navigation.module.scss';

/** Returns the corresponding FontAwesome icon. */
const getIcon = (type: Props.ItemType): FontAwesome.Props => {
  switch (type) {
    case Props.ItemType.CAMERA:
      return FontAwesomeIcon.faVideo;
    case Props.ItemType.CONSTRUCTION:
      return FontAwesomeIcon.faCube;
    case Props.ItemType.GITHUB:
      return FontAwesomeBrandIcon.faGithub;
    case Props.ItemType.SHARE:
      return FontAwesomeIcon.faShareSquare;
    case Props.ItemType.INFO:
      return FontAwesomeIcon.faInfo;
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
  /** @const Holds tree-view context. */
  const { activeKeyContext } = React.useContext(Context.TreeView);

  /** @const Holds opening directory state. */
  const [activeKey, handleChange] = activeKeyContext;

  return (
    <div {...divProps} className={styles['tree']}>
      <Collapse.Wrapper
        onChange={handleChange}
        activeKey={activeKey}
        motion={NavigationMotion}
      >
        <Collapse.Panel
          header="Menu"
          key="menu"
          showArrow={true}
          icon={FontAwesomeIcon.faHome}
        >
          <Item title="README" key="readme" type="document" />
          <Item title="WebRTC" key="webrtc" type="camera" />
          <Item title="SLAM" key="slam" type="construction" />
          <Item title="SfM" key="sfm" type="construction" />
        </Collapse.Panel>
        <Collapse.Panel
          header="Contribution"
          key="contribution"
          showArrow={true}
          icon={FontAwesomeIcon.faUsers}
        >
          <Item title="Report a bug" key="bugreport" type="github" />
          <Item title="Get help" key="gethelp" type="github" />
          <Item title="Share this app" key="share" type="share" />
        </Collapse.Panel>
        <Collapse.Panel
          header="About"
          key="about"
          showArrow={true}
          icon={FontAwesomeIcon.faInfoCircle}
        >
          <Item title="Github acount" key="acount" type="github" />
        </Collapse.Panel>
      </Collapse.Wrapper>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'TreeView';
