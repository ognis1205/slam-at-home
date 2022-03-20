/**
 * @fileoverview Defines Menu component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Header from './header';
import * as Item from './item';
import * as Section from './section';
import * as Collapse from '../../components/collapse';
import * as Drawer from '../../components/drawer';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import DrawerMotion from '../../assets/motions/drawer';
import styles from '../../assets/styles/containers/menu.module.scss';

/** Returns a `Menu` component. */
export const Component: React.FunctionComponent<Props.Menu> = ({
  open,
  onClose,
  ...drawerProps
}: Props.Menu): React.ReactElement => {
  /** @const */
  const [accordion] = React.useState<boolean>(false);

  /** @const */
  const [activeKey, setActiveKey] = React.useState<string[] | string>(['header1']);

  /***/
  const handleChange = (activeKey: string): void => setActiveKey(activeKey);

  /***/
  const handleClose = (): void => {
    console.log(onClose);
    if (onClose) onClose();
  };

  /***/
  const items = [
    { title: 'ITEM1', icon: FontAwesomeIcon.faCog },
    { title: 'ITEM2', icon: FontAwesomeIcon.faCog },
  ];

  /***/
  const test = (
    <Collapse.Panel
      key="5"
      header="HEADER 5"
      headerClassName={styles['section']}
      showArrow={true}
    >
      <Item.Component icon={FontAwesomeIcon.faCog} title={"test"} />
    </Collapse.Panel>
  );

  return (
    <Drawer.Component
      {...drawerProps}
      width="250px"
      open={open}
      onClose={handleClose}
      handler={false}
      drawPane={null}
    >
      <Header.Component />
      <Collapse.Wrapper
        accordion={accordion}
        onChange={handleChange}
        activeKey={activeKey}
        motion={DrawerMotion}
      >
        {test}
        <Section.Component header="HEADER1" key="header1" items={items} />
      </Collapse.Wrapper>
    </Drawer.Component>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Menu';
