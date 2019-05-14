import React from 'react';

import { Button } from 'components/Button/Button';
import ColorPicker from 'components/ColorPicker/ColorPicker';
import Devices from 'components/Devices/Devices';

import { FRDevice } from 'app';
import FruityRazer from 'FruityRazer';
import { getPostDataForDevice } from 'utils/deviceUtils';

import { SEND_FROM_TOUCHBAR_EVENT, SET_COLOR_FROM_TOUCHBAR_EVENT } from './constants';

import settings from 'settings.svg';
import styles from './Container.module.css';

const { remote, ipcRenderer } = window.require('electron');
const storage = window.require('electron-json-storage');

interface AppState {
  deviceColors: Record<string, string>;
  devices: FRDevice[];
  hex: string;
  selectedDevices: string[];
}

// TODO: Move this somewhere
declare global {
  interface Window {
    require: any;
  }
}

const { Menu, MenuItem } = remote;

export default class App extends React.PureComponent<{}, AppState> {
  public containerRef = React.createRef<HTMLDivElement>();

  public state = {
    deviceColors: {},
    devices: [],
    hex: 'FF1111',
    selectedDevices: [],
  };

  public componentDidMount() {
    this.setColorFromStorage();

    ipcRenderer.on(SET_COLOR_FROM_TOUCHBAR_EVENT, this.handleSetColorFromTouchBar);
    ipcRenderer.on(SEND_FROM_TOUCHBAR_EVENT, this.handleSendFromTouchBar);
  }

  public componentDidUpdate({}, prevState: AppState) {
    const { devices } = this.state;

    if (
      this.containerRef.current &&
      devices.length !== prevState.devices.length
    ) {
      ipcRenderer.send(
        'resize-window',
        this.containerRef.current.clientHeight,
      );
    }
  }

  public getAreAllDevicesSelected(): boolean {
    const { devices, selectedDevices } = this.state;

    return devices.length === selectedDevices.length;
  }

  public setColorFromStorage(): void {
    storage.getAll((error: any, data: any) => {
      if (error) {
        return;
      }

      data.devices.forEach(({ device, hex }: { device: string; hex: string }) => {
          const postData = getPostDataForDevice(device, hex);

          FruityRazer.sendLightingMessage(device, postData);
        },
      );

      if (data.selectedDevices) {
        this.setState({
          selectedDevices: data.selectedDevices,
        });
      }
    });
  }

  public setDevices = (devices: FRDevice[] = []): void => {
    this.setState({
      devices: devices.filter((device) => device.connected),
    });
  }

  public handleColorChange = (color: any): void => {
    const hex = color.hex.toUpperCase().replace('#', '');

    this.setState({
      hex,
    });
  }

  public handleContextMenu = (): void => {
    const menu = new Menu();

    menu.append(
      new MenuItem({
        click: () => {
          ipcRenderer.send('quit');
        },
        label: 'Quit App',
      }),
    );

    menu.popup({});
  }

  public handleDeviceClick = (shortName: string): void => {
    const { selectedDevices } = this.state;

    const newSelectedDevices: string[] = [...selectedDevices];

    const index = newSelectedDevices.indexOf(shortName);

    if (index === -1) {
      newSelectedDevices.push(shortName);
    } else {
      newSelectedDevices.splice(index, 1);
    }

    // TODO: Is this overkill?
    if (newSelectedDevices !== selectedDevices) {
      storage.set('selectedDevices', newSelectedDevices);

      this.setState({
        selectedDevices: newSelectedDevices,
      });
    }
  }

  public handleSave = (): void => {
    const { selectedDevices, hex } = this.state;

    const data = selectedDevices.map((device) => {
      return { device, hex };
    });

    storage.set('devices', data);

    selectedDevices.forEach((device) => {
      const postData = getPostDataForDevice(device, hex);

      // TODO: Should this be async?
      FruityRazer.sendLightingMessage(device, postData);
    });
  }

  public handleSelectAllClick = (): void => {
    const { devices, selectedDevices } = this.state;

    if (selectedDevices.length) {
      this.setState({
        selectedDevices: [],
      });
    } else {
      this.setState({
        // TODO: Fix this
        selectedDevices: devices.map((device: FRDevice) => device.shortName),
      });
    }
  }

  public handleSendFromTouchBar = (): void => {
    this.handleSave();
  }

  public handleSetColorFromTouchBar = (event: Event, hex: string): void => {
    this.handleColorChange({ hex });
  }

  public renderSelectAllText(): string {
    const areAllDevicesSelected = this.getAreAllDevicesSelected();

    return areAllDevicesSelected ? 'Unselect' : 'Select';
  }

  public render() {
    const { devices, hex, selectedDevices } = this.state;

    const selectAllText = this.renderSelectAllText();

    const style = {
      // backgroundColor: `#${hex}`,
    };

    console.log(style);

    return (
      <div
        className={styles.container}
        ref={this.containerRef}
        style={style}
      >
        <div className={styles.content}>
          <h2>Connected Devices</h2>

          <p>
            Choose the selected devices you'd like to update, or{' '}
            <a onClick={this.handleSelectAllClick}>{selectAllText} them all</a>.
          </p>

          <Devices
            devices={devices}
            onDeviceClick={this.handleDeviceClick}
            onSetDevices={this.setDevices}
            selectedDevices={selectedDevices}
          />

          <ColorPicker onChange={this.handleColorChange} color={`#${hex}`} />
        </div>

        <div className={styles.footer}>
          <Button onClick={this.handleSave} text="Send to Devices" />

          <a className={styles.settings} onClick={this.handleContextMenu}>
            <img src={settings} />
          </a>
        </div>
      </div>
    );
  }
}
