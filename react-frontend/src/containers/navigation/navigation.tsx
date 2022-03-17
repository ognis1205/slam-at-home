/**
 * @fileoverview Defines Navigation component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Header from './header';
import * as Footer from './footer';
import * as TreeView from './treeview';
import styles from '../../assets/styles/containers/navigation.module.scss';

/** Returns a `Navigation` component. */
export const Component: React.FunctionComponent<Props.Navigation> = ({
  ...divAttrs
}: Props.Navigation): React.ReactElement => (
  <div {...divAttrs} className={styles['navigation']}>
    <Header.Component />
    <TreeView.Component />
    <Footer.Component />
  </div>
);

/** Sets the component's display name. */
Component.displayName = 'Navigation';
