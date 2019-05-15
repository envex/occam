import * as React from 'react';

import { FRDevice } from 'app';
import SendButton from './SendButton';

import { DEVICE_TYPES } from '../../constants';

import styles from './Device.module.scss';

interface DeviceProps {
  device: FRDevice;
  onClick: (name: string) => void;
}

export default class Device extends React.Component<DeviceProps> {
  public handleClick = (): void => {
    const {
      device: { shortName },
      onClick,
    } = this.props;

    onClick(shortName);
  }

  public render() {
    const { device } = this.props;

    const fullName = device.fullName.replace('Razer', '');
    const type: string = DEVICE_TYPES[device.shortName];

    return (
      <span className={styles.container}>
        <span className={styles.name}>{fullName}</span>
        <span className={styles.type}>{type}</span>

        <SendButton onClick={this.handleClick} />
      </span>
    );
  }
}
