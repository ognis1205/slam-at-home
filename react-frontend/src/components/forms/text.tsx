/**
 * @fileoverview Defines Text component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Toggle from './toggle';
import * as FAUtil from '../../utils/fontawesome';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import styles from '../../assets/styles/components/forms.module.scss';

/** Returns the class name of the toggle. */
const getClassName = (className: string): string =>
  classnames(styles['text'], {
    [className || '']: !!className,
  });

/** Returns a `Text` component. */
export const Component: React.FunctionComponent<Props.Text> = ({
  className,
  id,
  name,
  placeholder,
  toggleId,
  toggleName,
  checked,
  disabled,
  onChange,
  icon,
  ...divAttrs
}: Props.Text): React.ReactElement => {
  /** An event handler called on 'change' events. */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange) onChange(e);
  };

  /** Icon element. */
  const iconElement = FAUtil.isProps(icon) ? (
    <span className={styles['icon']}>
      <FontAwesome.FontAwesomeIcon icon={icon} />
    </span>
  ) : icon ? (
    <span className={styles['icon']}>{icon}</span>
  ) : null;

  return (
    <div {...divAttrs} className={getClassName(className)}>
      {iconElement}
      <input
        type="text"
        id={id}
        name={name}
        className={styles['input']}
        autoComplete="off"
        placeholder={placeholder}
      />
      <Toggle.Component
        id={toggleId}
        name={toggleName}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Text';
