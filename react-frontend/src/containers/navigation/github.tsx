/**
 * @fileoverview Defines Github component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';

/** Returns a `Github` component. */
export const Component: React.FunctionComponent<Props.Github> = ({
  href,
  dataShowCount,
  ariaLevel,
  ...aAttrs
}: Props.Github): React.ReactElement => (
  <a
    {...aAttrs}
    className="github-button"
    href={href}
    data-show-count={dataShowCount}
    aria-label={ariaLevel}
  >
    Star
  </a>
);

/** Sets the component's display name. */
Component.displayName = 'Github';
