/**
 * @fileoverview Defines Section component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Item from './item';
import * as Collapse from '../../components/collapse';
import styles from '../../assets/styles/containers/menu.module.scss';

/** Returns a `Section` component. */
export const Component: React.FunctionComponent<Props.Section> = ({
  header,
  key,
  items,
}: Props.Section): React.ReactElement => (
  <Collapse.Panel header={header} key={key}>
    TEST
  </Collapse.Panel>
);

/** Sets the component's display name. */
Component.displayName = 'Section';
