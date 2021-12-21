/**
 * @fileoverview Defines {Motion} component.
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
import * as Props from './props';
import * as Stage from './stage';
import * as DOM from '../../utils/dom';
import * as Event from '../../utils/event';
import * as Ref from '../../utils/ref';
import classnames from 'classnames';

/** TODO: Refactor this fragment into function component if possible. */
class MotionFragment extends React.Component<{children: React.ReactNode}> {
  render() {
    return this.props.children;
  }
}

/** Returns a status name according to the transition type. */
const getStatus = (
  name: Props.Name,
  status: Stage.Status,
): string => {
  if (!name)
    return null;
  if (typeof name === 'object')
    return name[status];
  return status;
};

/** Returns a cue name according to the transition type. */
const getCue = (
  cue: Stage.Cue,
): string => {
  if (cue === Stage.Cue.Prepare)
    return 'prepare';
  else if (Stage.isActiveCue(cue))
    return 'active';
  else if (cue === Stage.Cue.Start)
    return 'start';
  else
    return null;
};

/** Returns a class name according to the transition type. */
const getTransition = (
  name: Props.Name,
  status: Stage.Status,
  cue: Stage.Cue,
): string =>
  classnames(getStatus(name, status), getCue(cue), {
    [name as string]: typeof name === 'string',
  });

/**
 * Configures and Returns a `Motion` component.
 * @param {boolan} support Flag that specifies whether transition is supported or not.
 * @return {Motion} A React function component.
 */
const configure = (
  support: boolean
): React.ForwardRefExoticComponent<Props.Motion & { ref?: React.Ref<any> }> => {
  /** Returns `true` if the component supports transition. */
  const transitionIsDefined = (name: Props.Name): boolean =>
    !!(name && support);

  /** Defines {Motion} components. */
  const Component = React.forwardRef<any, Props.Motion>(({
      name,
      exitedClassName,
      transition = getTransition,
      visible = true,
      forceRender,
      removeOnExit = true,
      children,
      ...rest
    }: Props.Motion, 
    ref: any
  ): React.ReactElement => {
    /** Holds a reference to the react node, it may be a HTMLElement. */
    const node = React.useRef<any>(null);

    /** Holds a reference to the fragment fragment. */
    const fragment = React.useRef<MotionFragment>(null);

    /** Returns the DOM target element. */
    const getElement = (): HTMLElement => {
      try {
        return node.current instanceof HTMLElement
             ? node.current
             : DOM.find<HTMLElement>(fragment.current);
      } catch (e) {
        return null;
      }
    };

    /** Manages transition status by this hook. */
    const [status, cue, style, mergedVisible] = Stage.useStatus(
      transitionIsDefined(name),
      visible,
      getElement,
      rest,
    );

    /** Record whether content has rendered. */
    const hasRendered = React.useRef<boolean>(mergedVisible);
    if (mergedVisible)
      hasRendered.current = true;

    /** Returns `true` if the motion status has been set active. */
    const isRendered = (): boolean =>
      hasRendered.current;

    /** Forwards ref. */
    const setRef = React.useCallback((element: any) => {
      node.current = element;
      Ref.fill(ref, element);
    }, []);

    // Dispatches motion.
    let motion: React.ReactNode;
    const context = { visible, ...rest };
    if (!children) {
      motion = null as React.ReactNode;
    } else if (status === Stage.Status.None || !transitionIsDefined(name)) {
      if (mergedVisible) {
        motion = children(
          { ...context },
          setRef,
        );
      } else if (!removeOnExit && isRendered()) {
        motion = children(
          { ...context, className: exitedClassName },
          setRef,
        );
      } else if (forceRender) {
        motion = children(
          { ...context, style: { display: 'none' } },
          setRef,
        );
      } else {
        motion = null;
      }
    } else {
      motion = children(
        { ...context, className: transition(name, status, cue), style: style },
        setRef,
      );
    }

    return <MotionFragment ref={fragment}>{motion}</MotionFragment>;
  });

  /** Sets the component's display name. */
  Component.displayName = 'Motion';

  return Component;
};

/** Exports configured exotic compoent. */
export const Component = configure(Event.supportTransition());
