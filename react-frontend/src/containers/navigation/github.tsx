/**
 * @fileoverview Defines Github component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import * as Hook from '../../utils/hook';

/** Returns a `Github` component. */
export const Component: React.FunctionComponent<Props.Github> = ({
  href,
  dataShowCount,
  ariaLabel,
  ...aAttrs
}: Props.Github): React.ReactElement => {
  /** @const Holds github script loading state. */
  const github = Hook.useExternalScript('https://buttons.github.io/buttons.js');

  if (github === Hook.ScriptState.READY) {
    return (
      <a
        {...aAttrs}
        className="github-button"
        href={href}
        data-show-count={dataShowCount}
        aria-label={ariaLabel}
      >
        Star
      </a>
    );
  } else {
    return null;
  }
};

/** Sets the component's display name. */
Component.displayName = 'Github';
