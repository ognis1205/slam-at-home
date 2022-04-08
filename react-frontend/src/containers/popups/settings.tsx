/**
 * @fileoverview Defines Settings component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Props from './props';
import * as Window from './window';
import * as Reducks from '../../redux/modules/signaling';
import * as Forms from '../../components/forms';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import styles from '../../assets/styles/containers/popups.module.scss';
import validator from 'validator';
import { v4 as uuid } from 'uuid';

/** Returns a `Settings` component. */
export const Component: React.FunctionComponent<Props.Settings> = ({
  checked,
  url,
  devices,
  onClose,
  ...windowProps
}: Props.Settings): React.ReactElement => {
  /** @const Holds the reference to the Redux dispatcher. */
  const dispatch = ReactRedux.useDispatch();

  /** @const Holds a state to of the error message. */
  const [error, setError] = React.useState<boolean>(false);

  /** @const Holds a state to of the input. */
  const [isEmpty, setEmpty] = React.useState<boolean>(!url);

  /** Event listener which is responsible for `onCheck`. */
  const handleCheck = (url: string) => {
    if (checked) dispatch(Reducks.disconnect());
    else dispatch(Reducks.connect(url, uuid()));
  };

  /** Returns `true` if the value is valid URL. */
  const isValidURL = (value: string): boolean =>
    !value ||
    validator.isIP(value) ||
    validator.isFQDN(value, { require_tld: false });

  /** Returns `true` if the value is valid port. */
  const isValidPort = (value: string): boolean => validator.isPort(value);

  /** Returns `true` if the value is valid input. */
  const isValidInput = (value: string): boolean => {
    if (value) setEmpty(false);
    else setEmpty(true);

    const tokens = value.split(':');
    if (tokens.length === 1) {
      return isValidURL(tokens[0]);
    } else if (tokens.length === 2) {
      return isValidURL(tokens[0]) && isValidPort(tokens[1]);
    } else {
      return false;
    }
  };

  /** An event handler called on 'change' events. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (isValidInput(e.target.value)) setError(false);
    else setError(true);
  };

  const test = [
    { value: 'option1', name: 'option1' },
    { value: 'option2', name: 'option2' },
    { value: 'option3', name: 'option3' },
    { value: 'option4', name: 'option4' },
    { value: 'option5', name: 'option5' },
  ];

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
        id="url"
        name="url"
        placeholder="0.0.0.0:10000"
        toggleId="text-toggle"
        toggleName="text-toggle"
        className={checked ? 'checked' : ''}
        value={url}
        icon={FontAwesomeIcon.faWifi}
        checked={checked}
        textDisabled={checked}
        checkDisabled={isEmpty || error}
        onCheck={handleCheck}
        onChange={handleChange}
      />
      {error ? (
        <span className={styles['error']}>
          Specify a valid IP address or FQDN of the signaling server
        </span>
      ) : null}
      <div className={styles['divider']}>Devices</div>
      <Forms.Select
        id="camera"
        options={devices.map((o) => {
          return { value: o.id, name: o.name };
        })}
      />
      <div className={styles['divider']}>Peer Connection</div>
    </Window.Component>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Settings';
