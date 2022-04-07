/**
 * @fileoverview Defines {SLAM} component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as NextApp from 'next/app';
import * as Store from '../redux/store';
import * as Panel from '../containers/panel';
import * as Notification from '../containers/notification';
import Head from 'next/head';
import NotificationMotion from '../assets/motions/notification';
import '../assets/styles/reset.css';
import '../assets/styles/global.scss';

/** Returns a `SLAM` component. */
const SLAM: React.FC<NextApp.AppProps> = ({ Component, pageProps }) => (
  <React.Fragment>
    <Head>
      <title>SLAM@HOME</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
    </Head>
    <Panel.Component>
      <Component {...pageProps} />
    </Panel.Component>
    <Notification.Component
      duration={1000}
      placement="right"
      motion={NotificationMotion}
    />
  </React.Fragment>
);

// export default SLAM;
export default Store.wrapper.withRedux(SLAM);
