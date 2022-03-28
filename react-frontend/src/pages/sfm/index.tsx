/**
 * @fileoverview Defines sfm page.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Next from 'next';
import * as Maintenance from '../../containers/maintenance';

/** Returns a '/sfm' page. */
const SfM: Next.NextPage = () => {
  return <Maintenance.Component />;
};

export default SfM;
