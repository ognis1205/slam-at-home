/**
 * @fileoverview Defines Settings component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Description from './description';
import * as Window from './window';
import * as Forms from '../../components/forms';
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
//    console.log(e);
//    console.log(e.target);
//    console.log(e.target.value);
//    console.log(e.target.checked);
    console.log(checked);
  };

  return (
    <Window.Component
      {...windowProps}
      className={styles['about']}
      type="info"
      title="About"
      onClose={onClose}
    >
      <Description.Component>
        {
          // eslint-disable-next-line prettier/prettier
        }This application is a part of SLAM@HOME project. For more details such as usage restrictions, please refer to the link below.
      </Description.Component>
      <Forms.Toggle
        id="test"
        name="test"
        checked={checked}
        onChange={handleCheck}
      />
    </Window.Component>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Settings';
