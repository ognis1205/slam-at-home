/**
 * @fileoverview Defines {Left}, {Right} and {Divider} properties.
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
import * as Draggable from '../../components/draggable';
import * as Position from '../../utils/position';

/** A {Left} component properties. */
export interface Left {
  [key: string]: unknown;
}

/** A {Right} component properties. */
export interface Right {
  [key: string]: unknown;
}

/** A {Divider} component properties. */
export interface Divider extends Draggable.Props {
//  axis: Position.Axis,
//  position?: Position.Coord;
//  defaultPosition?: Position.Coord;
}
