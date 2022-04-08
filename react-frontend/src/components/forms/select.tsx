/**
 * @fileoverview Defines Select component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import classnames from 'classnames';
import styles from '../../assets/styles/components/forms.module.scss';

/** Returns the class name of the select. */
const getClassName = (className: string): string =>
  classnames(styles['select'], {
    [className || '']: !!className,
  });

/** Returns a `Select` component. */
export const Component: React.FunctionComponent<Props.Select> = ({
  className,
  id,
  onCheck,
  options = [],
  ...divAttrs
}: Props.Select): React.ReactElement => (
  <div {...divAttrs} className={getClassName(className)}>
    {options.length === 0 ? (
      <div className={styles['empty']}>No devices found</div>
    ) : (
      <select id={id} className={styles['scroll']} multiple>
        {options.map(({ value, name }: Props.Option, index: number) => (
          <option key={index} value={value}>
            {name}
          </option>
        ))}
      </select>
    )}
    <span className="focus"></span>
  </div>
);

/** Sets the component's display name. */
Component.displayName = 'Select';
