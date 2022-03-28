/**
 * @fileoverview
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as NextApp from 'next/app';
import Head from 'next/head';
import * as Store from '../redux/store';
import * as Notifications from '../redux/modules/notifications';
import * as Collapse from '../components/collapse';
import * as Panel from '../containers/panel';
import * as Notification from '../containers/notification';
import NotificationMotion from '../assets/motions/notification';
import '../assets/styles/reset.css';
import '../assets/styles/global.scss';
import { faCog } from '@fortawesome/free-solid-svg-icons';

/***/
const text = `
content content content content content
content content content content content
content content content content content
content content content content content
content content content content content
`;

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

/***/
const SLAM: React.FC<NextApp.AppProps> = ({ Component, pageProps }) => {
  /** @const */
  const [accordion] = React.useState<boolean>(false);

  /** @const */
  const [activeKey, setActiveKey] = React.useState<string[] | string>(['4']);

  /** @const */
  const getItems = (): React.ReactElement[] => {
    const items = [];
    for (let i = 0, len = 3; i < len; i += 1) {
      const key = i + 1;
      items.push(
        <Collapse.Panel
          header={`HEADER ${key}`}
          headerClassName="test"
          icon={faCog}
          key={key}
        >
          <p>
            {text}: {i}
          </p>
        </Collapse.Panel>
      );
    }
    items.push(
      <Collapse.Panel header="HEADER 4" key="4">
        <Collapse.Wrapper defaultActiveKey="1">
          <Collapse.Panel header="NESTED HEADER" key="1" id="header-test">
            <p>header panel 4</p>
          </Collapse.Panel>
        </Collapse.Wrapper>
      </Collapse.Panel>
    );
    items.push(
      <Collapse.Panel header="HEADER 5" key="5">
        <Collapse.Wrapper>
          <Collapse.Panel header="NESTED HEADER" key="1" id="another-test">
            <form>
              <label htmlFor="test">Name:&nbsp;</label>
              <input type="text" id="test" />
            </form>
          </Collapse.Panel>
        </Collapse.Wrapper>
      </Collapse.Panel>
    );
    return items;
  };

  const handleChange = (activeKey: string): void => setActiveKey(activeKey);

  return (
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
};

// export default SLAM;
export default Store.wrapper.withRedux(SLAM);
