/**
 * @fileoverview Defines Settings component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Props from './props';
import * as Window from './window';
import * as RTCModule from '../../redux/modules/rtc';
import * as SignalingModule from '../../redux/modules/signaling';
import * as Forms from '../../components/forms';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as FontAwesomeSolidIcon from '@fortawesome/free-solid-svg-icons';
import * as FontAwesomeRegularIcon from '@fortawesome/free-regular-svg-icons';
import styles from '../../assets/styles/containers/popups.module.scss';
import validator from 'validator';
import { v4 as uuid } from 'uuid';

/** Returns a `Settings` component. */
export const Component: React.FunctionComponent<Props.Settings> = ({
  checked,
  status,
  url,
  selected,
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

  /** Event listener which is responsible for `oncheck`. */
  const handleCheck = (url: string) => {
    if (checked) dispatch(SignalingModule.disconnect());
    else dispatch(SignalingModule.connect(url, uuid()));
  };

  /** Event listener which is responsible for `onchange`. */
  const handleSelectChange = (remoteId: string) => {
    dispatch(RTCModule.offer(remoteId));
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
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (isValidInput(e.target.value)) setError(false);
    else setError(true);
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
        id="url"
        name="url"
        placeholder="0.0.0.0:10000"
        toggleId="text-toggle"
        toggleName="text-toggle"
        className={checked ? 'checked' : ''}
        value={url}
        icon={FontAwesomeSolidIcon.faWifi}
        checked={checked}
        textDisabled={checked}
        checkDisabled={isEmpty || error}
        onCheck={handleCheck}
        onChange={handleTextChange}
      />
      {error ? (
        <span className={styles['error']}>
          Specify a valid IP address or FQDN of the signaling server
        </span>
      ) : null}
      <div className={styles['divider']}>Devices</div>
      <Forms.Select
        id="camera"
        emptyText="No Devices Found"
        onChange={handleSelectChange}
        options={devices.map((o) => {
          return { value: o.id, name: o.name, selected: o.id === selected };
        })}
      />
      <div className={styles['divider']}>Peer Connection</div>
      <div className={styles['status']}>
        <div className={styles['item']}>
          <span className={styles['icon']}>
            <FontAwesome.FontAwesomeIcon icon={FontAwesomeSolidIcon.faUser} />
          </span>
          <span className={styles['name']}>Local ID</span>
          <span className={styles['value']}>
            {status.localId ? status.localId : 'Not Specified'}
          </span>
        </div>
        <div className={styles['item']}>
          <span className={styles['icon']}>
            <FontAwesome.FontAwesomeIcon icon={FontAwesomeRegularIcon.faUser} />
          </span>
          <span className={styles['name']}>Remote ID</span>
          <span className={styles['value']}>
            {status.remoteId ? status.remoteId : 'Not Specified'}
          </span>
        </div>
        <div className={styles['item']}>
          <span className={styles['icon']}>
            <FontAwesome.FontAwesomeIcon icon={FontAwesomeSolidIcon.faFile} />
          </span>
          <span className={styles['name']}>Local SDP</span>
          <span className={styles['value']}>
            {status.hasLocalSDP ? 'Yes' : 'No'}
          </span>
        </div>
        <div className={styles['item']}>
          <span className={styles['icon']}>
            <FontAwesome.FontAwesomeIcon icon={FontAwesomeRegularIcon.faFile} />
          </span>
          <span className={styles['name']}>Remote SDP</span>
          <span className={styles['value']}>
            {status.hasRemoteSDP ? 'Yes' : 'No'}
          </span>
        </div>
        <div className={styles['item']}>
          <span className={styles['icon']}>
            <FontAwesome.FontAwesomeIcon
              icon={FontAwesomeSolidIcon.faHashtag}
            />
          </span>
          <span className={styles['name']}>Recieved Local Cadidates</span>
          <span className={styles['value']}>{status.localCandidate}</span>
        </div>
        <div className={styles['item']}>
          <span className={styles['icon']}>
            <FontAwesome.FontAwesomeIcon
              icon={FontAwesomeSolidIcon.faHashtag}
            />
          </span>
          <span className={styles['name']}>Recieved Remote Cadidates</span>
          <span className={styles['value']}>{status.remoteCandidate}</span>
        </div>
      </div>
    </Window.Component>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Settings';
