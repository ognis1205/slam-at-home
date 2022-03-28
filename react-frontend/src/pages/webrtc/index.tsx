/**
 * @fileoverview Defines webrtc page.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Next from 'next';
import * as Maintenance from '../../containers/maintenance';

/** Returns a '/webrtc' page. */
const WebRTC: Next.NextPage = () => {
  return <Maintenance.Component />;
};

export default WebRTC;
