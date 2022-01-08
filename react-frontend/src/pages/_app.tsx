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
import * as Pane from '../containers/pane';
import '../assets/styles/global.scss';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

/***/
const text = `
content content content content content
content content content content content
content content content content content
content content content content content
content content content content content
`;

/***/
const SLAM: React.FC<NextApp.AppProps> = ({}) => {
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
          icon={<FontAwesomeIcon icon={faCog} />}
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
        <title>SLAM</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Pane.Left>
        <ul>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
        </ul>
      </Pane.Left>
      <Pane.Divider />
      <Pane.Right>
        <ul>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
        </ul>
      </Pane.Right>
      <Drawer.Component width="30vh" drawPane={null}>
        <Image src="/images/logo.png" alt="SLAM@Home" width="128" height="64" />
        <Collapse.Wrapper
          accordion={accordion}
          onChange={handleChange}
          activeKey={activeKey}
        >
          {getItems()}
        </Collapse.Wrapper>
      </Drawer.Component>
    </React.Fragment>
  );
};

export default SLAM;
