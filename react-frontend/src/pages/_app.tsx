/**
 * @fileoverview Defines {SLAM} component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as NextApp from 'next/app';
import Head from 'next/head';
import * as Store from '../redux/store';
import * as Notifications from '../redux/modules/notifications';
import * as Panel from '../containers/panel';
import * as Notification from '../containers/notification';
import NotificationMotion from '../assets/motions/notification';
import '../assets/styles/reset.css';
import '../assets/styles/global.scss';

const Test: React.FunctionComponent = (): React.ReactElement => {
  /***/
  const dispatch = ReactRedux.useDispatch();

  return (
    <p>
      <button
        className="btn btn-primary"
        onClick={() => {
          dispatch(
            Notifications.info({
              title: 'Info',
              message: 'Information notification message',
              showCloseButton: true,
            })
          );
        }}
      >
        Info
      </button>
      <button
        className="btn btn-primary"
        onClick={() => {
          dispatch(
            Notifications.success({
              title: 'Success',
              message: 'Information notification message',
              showCloseButton: true,
            })
          );
        }}
      >
        Success
      </button>
      <button
        className="btn btn-primary"
        onClick={() => {
          dispatch(
            Notifications.warning({
              title: 'Warning',
              message: 'Information notification message',
              showCloseButton: true,
            })
          );
        }}
      >
        Warning
      </button>
      <button
        className="btn btn-primary"
        onClick={() => {
          dispatch(
            Notifications.error({
              title: 'Error',
              message: 'Information notification message',
              showCloseButton: true,
            })
          );
        }}
      >
        Error
      </button>
    </p>
  );
};

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
