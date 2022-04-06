/**
 * @fileoverview Defines Settings component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Window from './window';
import * as Forms from '../../components/forms';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import styles from '../../assets/styles/containers/popups.module.scss';

/** Returns a `Settings` component. */
export const Component: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement> & {
    onClose?: () => void;
  }
> = ({
  onClose,
  ...windowProps
}: React.HTMLAttributes<HTMLDivElement> & {
  onClose?: () => void;
}): React.ReactElement => {
  /***/
  const [checked, setChecked] = React.useState<boolean>(false);

  /***/
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return (
    <Window.Component
      {...windowProps}
      className={styles['settings']}
      type="setting"
      title="Settings"
      onClose={onClose}
    >
      <div className={styles['divider']}>Signaling Server</div>
      <Forms.Text
        id="text"
        name="text"
        placeholder="placeholder"
        toggleId="text-toggle"
        toggleName="text-toggle"
        icon={FontAwesomeIcon.faWifi}
        checked={checked}
        onChange={handleCheck}
      />
    </Window.Component>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Settings';
