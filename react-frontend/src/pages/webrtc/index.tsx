/**
 * @fileoverview Defines webrtc page.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Next from 'next';
import * as Players from '../../components/players';
import * as Maintenance from '../../containers/maintenance';
import * as Store from '../../redux/store';

/** Returns a '/webrtc' page. */
const WebRTC: Next.NextPage = () => {
  /** @const Holds a Redux state of the p2p module. */
  const rtcStore = ReactRedux.useSelector((store: Store.Type) => store.rtc);

  return <Players.Video stream={rtcStore.stream} />;
};

export default WebRTC;
