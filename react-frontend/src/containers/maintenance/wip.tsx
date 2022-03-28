/**
 * @fileoverview Defines WIP component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import styles from '../../assets/styles/containers/maintenance.module.scss';

/** Returns a `WIP` component. */
export const Component: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = (props: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  return (
    <div {...props} className={styles['wrapper']}>
      <div className={styles['animation']} />
      <section className={styles['content']}>
        <h1>Pardon my dust.</h1>
        <p>
          {
            // eslint-disable-next-line prettier/prettier
          }This page is currently WIP and is planned to deliver in the near future.
        </p>
        <footer>
          {
            // eslint-disable-next-line prettier/prettier
          }If you need to you can always <a href="mailto:shingo.okawa.g.h.c@gmail.com">contact me</a>.
        </footer>
      </section>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'WIP';
