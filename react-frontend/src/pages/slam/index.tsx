/**
 * @fileoverview Defines slam page.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Next from 'next';
import * as Maintenance from '../../containers/maintenance';

/** Returns a '/slam' page. */
const SLAM: Next.NextPage = () => {
  return <Maintenance.Component />;
};

export default SLAM;
