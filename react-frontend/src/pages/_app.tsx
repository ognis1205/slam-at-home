/**
 * @fileoverview
 * @copyright Shingo OKAWA 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from 'react';
import * as NextApp from 'next/app';
import Head from 'next/head';
import * as Drawer from '../components/drawer';
import * as Collapse from '../components/collapse';
import * as Motion from '../components/motion';
import '../assets/styles/global.scss';

/***/
const getCollapsedHeight: Motion.StartEventHandler = () =>
  ({ height: 0, opacity: 0 });

/***/
const getRealHeight: Motion.ActiveEventHandler = (node) =>
  ({ height: node.scrollHeight, opacity: 1 });

/***/
const getCurrentHeight: Motion.StartEventHandler = (node) =>
  ({ height: node.offsetHeight });

/***/
const skipOpacityTransition: Motion.DoneEventHandler = (_, event) =>
  (event as TransitionEvent).propertyName === 'height';

/***/
const motion: Motion.Props = {
  name: 'motion',
  onEnterStart: getCollapsedHeight,
  onEnterActive: getRealHeight,
  onExitStart: getCurrentHeight,
  onExitActive: getCollapsedHeight,
  onEnterDone: skipOpacityTransition,
  onExitDone: skipOpacityTransition,
  deadline: 500,
};

/***/
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

/***/
const arrowPath =
  'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88' +
  '.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.' +
  '6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.' +
  '2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';

/***/
const expandIcon = ({ isActive }): React.ReactElement => (
  <i style={{ marginRight: '.5rem' }}>
    <svg
      viewBox="0 0 1024 1024"
      width="1em"
      height="1em"
      fill="currentColor"
      style={{
        verticalAlign: '-.125em',
        transition: 'transform .2s',
        transform: `rotate(${isActive ? 90 : 0}deg)`,
      }}
    >
      <path d={arrowPath} p-id="5827" />
    </svg>
  </i>
);

/**
 *
 */
const SLAM: React.FC<NextApp.AppProps> = ({ Component, pageProps }) => {
  /** @const */
  const [accordion] = React.useState<boolean>(false);

  /** @const */
  const [activeKey, setActiveKey] = React.useState<any>(['4']);

  /** @const */
  const getItems = (): React.ReactElement[] => {
    const items = [];
    for (let i = 0, len = 3; i < len; i += 1) {
      const key = i + 1;
      items.push(
        <Collapse.Panel
          header={`This is panel header ${key}`}
          key={key}
        >
          <p>{text} {i}</p>
        </Collapse.Panel>,
      );
    }
    items.push(
      <Collapse.Panel header="This is panel header 4" key="4">
        <Collapse.Wrapper defaultActiveKey="1">
          <Collapse.Panel header="This is panel nest panel" key="1" id="header-test">
            <p>header panel 4</p>
          </Collapse.Panel>
        </Collapse.Wrapper>
      </Collapse.Panel>,
    );
    items.push(
      <Collapse.Panel header="This is panel header 5" key="5">
        <Collapse.Wrapper>
          <Collapse.Panel header="This is panel nest panel" key="1" id="another-test">
            <form>
              <label htmlFor="test">Name:&nbsp;</label>
              <input type="text" id="test" />
            </form>
          </Collapse.Panel>
        </Collapse.Wrapper>
      </Collapse.Panel>,
    );
    return items;
  }

  const handleChange = (activeKey: string): void =>
    setActiveKey(activeKey);

  return (
    <React.Fragment>
      <Head>
        <title>SLAM UI</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <Drawer.Component width="30vh">
{/*  <Collapse.Wrapper>
    <Collapse.Panel header="title">content</Collapse.Panel>
    <Collapse.Panel header="title">content</Collapse.Panel>
    <React.Fragment>
      <Collapse.Panel header="title">content</Collapse.Panel>
      <Collapse.Panel header="title">content</Collapse.Panel>
    </React.Fragment>
    <React.Fragment>
      <React.Fragment>
        <Collapse.Panel header="title">content</Collapse.Panel>
        <Collapse.Panel header="title">content</Collapse.Panel>
      </React.Fragment>
    </React.Fragment>
  </Collapse.Wrapper>*/}
        <Collapse.Wrapper
          accordion={accordion}
          onChange={handleChange}
          activeKey={activeKey}
          motion={motion}
        >
          {getItems()}
        </Collapse.Wrapper>
      </Drawer.Component>
    </React.Fragment>
  );
};

export default SLAM;
