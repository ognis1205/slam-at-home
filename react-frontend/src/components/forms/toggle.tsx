/**
 * @fileoverview Defines Menu component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import classnames from 'classnames';
import styles from '../../assets/styles/components/forms.module.scss';

/** Returns the class name of the toggle. */
const getClassName = (className: string): string =>
  classnames(styles['toggle'], {
    [className || '']: !!className,
  });

/** Returns the class name of the label. */
const getLeftClassName = (disabled: boolean): string =>
  classnames(styles['switch-left'], {
    [styles['disabled']]: disabled,
  });

/** Returns the class name of the label. */
const getRightClassName = (disabled: boolean): string =>
  classnames(styles['switch-right'], {
    [styles['disabled']]: disabled,
  });

/** Returns a `Toggle` component. */
export const Component: React.FunctionComponent<Props.Toggle> = ({
  className,
  id,
  name,
  checked,
  disabled = false,
  onChange,
  options = { on: 'yes', off: 'no' },
  ...divAttrs
}: Props.Toggle): React.ReactElement => (
  <div {...divAttrs} className={getClassName(className)}>
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      disabled={disabled}
      className={styles['checkbox']}
      onChange={(e) => onChange(e)}
    />
    {id ? (
      <label className={styles['label']} htmlFor={id}>
        <span
          className={getLeftClassName(disabled)}
          data-on={options.on}
          data-off={options.off}
        />
        <span className={getRightClassName(disabled)} />
      </label>
    ) : null}
  </div>
);

/** Sets the component's display name. */
Component.displayName = 'Toggle';
