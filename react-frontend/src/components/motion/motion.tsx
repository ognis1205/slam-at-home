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
class Fragment extends React.Component<{children: React.ReactNode}> {
  render() {
    return this.props.children;
  }
}

/** Returns a class name according to the transition type. */
const getTransitionName = (
  name: Props.Name,
  status: string,
): string => {
  if (!name)
    return null;
  if (typeof name === 'object')
    return name[status.replace(
      /-\w/g,
      match => match[1].toUpperCase()
    )];
  return `${name}-${status}`;
};

/**
 * Configures and Returns a `Motion` component.
 * @param {boolan} support Flag that specifies whether transition is supported or not.
 * @return {Motion} A React function component.
 */
const configure = (
  support: boolean
): React.ForwardRefExoticComponent<Props.Motion & { ref?: React.Ref<any> }> => {
  /** Returns `true` if the component supports transition. */
  const supportTransition = (name: Props.Name): boolean =>
    !!(name && support);

  /** Defines {Motion} components. */
  const Component = React.forwardRef<any, Props.Motion>(({
      name,
      visible = true,
      forceRender,
      removeOnExit = true,
      exitedClassName,
      children,
      ...rest
    }: Props.Motion, 
    ref: any
  ) => {
    /** Holds a reference to the react node, it may be a HTMLElement. */
    const node = React.useRef<any>(null);

    /** Holds a reference to the wrapper fragment. */
    const fragment = React.useRef<Fragment>(null);

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
      supportTransition(name),
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
    const setRef = React.useCallback((node: any) => {
      node.current = node;
      Ref.fill(ref, node);
    }, []);

    // Dispatches motion.
    let motion: React.ReactNode;
    const context = { visible, ...rest };
    if (!children) {
      motion = null;
    } else if (status === Stage.Status.None || !supportTransition(name)) {
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
      let suffix: string;
      if (cue === Stage.Cue.Prepare)
        suffix = 'prepare';
      else if (Stage.isActiveCue(cue))
        suffix = 'active';
      else if (cue === Stage.Cue.Start)
        suffix = 'start';
      motion = children(
        {
          ...context,
          className: classnames(getTransitionName(name, status), {
            [getTransitionName(name, `${status}-${suffix}`)]: suffix,
            [name as string]: typeof name === 'string',
          }),
          style: style,
        },
        setRef,
      );
    }

    return <Fragment ref={fragment}>{motion}</Fragment>;
  });

  /** Sets the component's display name. */
  Component.displayName = 'WithMotion';

  return Component;
};

/** Exports configured exotic compoent. */
export const ExoticComponent = configure(Event.supportTransition());
