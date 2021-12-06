/**
 * @fileoverview Defines menu.
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
import type * as Accordion from '../components/accordion';
import type * as JSON from '../utils/json';

const items: Accordion.JSON<JSON.Primitive> = [
  {divider: "Divider 1"},
  {divider: "Divider 2"},
  {divider: "Divider 3"},
  {divider: "Divider 4"},
  {divider: "Divider 5"},
];

export default items;
