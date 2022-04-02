/**
 * @fileoverview Defines Settings component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Description from './description';
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
      className={styles['about']}
      type="setting"
      title="Settings"
      onClose={onClose}
    >
      <Description.Component>
        {
          // eslint-disable-next-line prettier/prettier
        }Establishing a WebRTC connection between two devices requires the use of signaling server to resolve how to connect them.
      </Description.Component>
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
