import * as React from 'react';

import FruityRazer from 'FruityRazer';

import Device from 'components/Device/Device';

import { FRDevice } from 'app';
import { USB_EVENT } from '../../constants';

import styles from './Devices.module.css';

const { ipcRenderer } = window.require('electron');

interface DevicesProps {
  devices: FRDevice[];
  onDeviceClick: (fullName: string) => void;
  onSetDevices: (devices: FRDevice[]) => void;
}

export default class Devices extends React.Component<DevicesProps> {
  public async componentDidMount() {
    this.getConnectedDevices();

    ipcRenderer.on(USB_EVENT, this.getConnectedDevices);
  }

  public getConnectedDevices = async () => {
    const { onSetDevices } = this.props;

    const devices = await FruityRazer.getDeviceList();

    if (devices) {
      onSetDevices(devices);
    }
  }

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
