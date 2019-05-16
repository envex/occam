import * as React from 'react';

import Device from 'components/Device/Device';

import { FRDevice } from 'app';

import styles from './Devices.module.css';

interface DevicesProps {
  devices: FRDevice[];
  onDeviceClick: (fullName: string) => void;
}

export default class Devices extends React.Component<DevicesProps> {

  public renderDevices(): React.ReactNode {
    const { devices, onDeviceClick } = this.props;

    return devices.map((device) => {
      const { connected } = device;

      if (!connected) {
        return null;
      }

      return (
        <Device
          device={device}
          key={device.shortName}
          onClick={onDeviceClick}
        />
      );
    });
  }

  public render() {
    const devices = this.renderDevices();

    return (
      <div className={styles.container}>
        {devices}
      </div>
    );
  }
}
