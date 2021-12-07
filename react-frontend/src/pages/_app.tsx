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
import menus from '../metadata/menu';

/**
 *
 */
const SLAM: React.FC<NextApp.AppProps> = ({ Component, pageProps }) => {
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
        <Collapse.Component items={menus} style={{
          height: '100%',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}/>
      </Drawer.Component>
    </React.Fragment>
  );
};

export default SLAM;
