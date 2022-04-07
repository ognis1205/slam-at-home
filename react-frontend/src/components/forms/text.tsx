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

/** Returns the class name of the icon. */
const getIconClassName = (className: string): string =>
  classnames(styles['icon'], {
    [styles[className] || '']: !!className,
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
  textDisabled,
  checkDisabled,
  onCheck,
  onChange,
  value,
  icon,
  ...divAttrs
}: Props.Text): React.ReactElement => {
  /** @const Holds a reference to the input element. */
  const input = React.useRef<HTMLInputElement>(null);

  /** An event handler called on 'change' events. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onCheck) onCheck(input.current?.value);
  };

  /** An event handler called on 'change' events. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange) onChange(e);
  };

  /** Icon element. */
  const iconElement = FAUtil.isProps(icon) ? (
    <span className={getIconClassName(className)}>
      <FontAwesome.FontAwesomeIcon icon={icon} />
    </span>
  ) : icon ? (
    <span className={getIconClassName(className)}>{icon}</span>
  ) : null;

  return (
    <div {...divAttrs} className={getClassName(className)}>
      {iconElement}
      <input
        ref={input}
        type="text"
        id={id}
        name={name}
        defaultValue={value}
        disabled={textDisabled}
        className={styles['input']}
        autoComplete="off"
        placeholder={placeholder}
        onChange={handleChange}
      />
      <Toggle.Component
        id={toggleId}
        name={toggleName}
        disabled={checkDisabled}
        checked={checked}
        onChange={handleCheck}
      />
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Text';
