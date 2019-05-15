import React from 'react';

import { Button } from 'components/Button/Button';
import { Close, Settings } from 'components/Icons';

import ColorPicker from 'components/ColorPicker/ColorPicker';
import Devices from 'components/Devices/Devices';
import Input from 'components/Input/Input';

import { FRDevice } from 'app';
import FruityRazer from 'FruityRazer';
import { getPostDataForDevice } from 'utils/deviceUtils';

import {
  CLOSE_WINDOW_EVENT,
  SEND_FROM_TOUCHBAR_EVENT,
  SET_COLOR_FROM_TOUCHBAR_EVENT,
} from './constants';

import styles from './Container.module.scss';

const { remote, ipcRenderer } = window.require('electron');
const storage = window.require('electron-json-storage');

interface ContainerState {
  deviceColors: Record<string, string>;
  devices: FRDevice[];
  hex: string;
}

// TODO: Move this somewhere
declare global {
  interface Window {
    require: any;
  }
}

const { Menu, MenuItem } = remote;

export default class App extends React.PureComponent<{}, ContainerState> {
  public containerRef = React.createRef<HTMLDivElement>();

  public state = {
    deviceColors: {},
    devices: [],
    hex: 'FF1111',
  };

  public componentDidMount() {
    this.setColorFromStorage();

    ipcRenderer.on(SET_COLOR_FROM_TOUCHBAR_EVENT, this.handleSetColorFromTouchBar);
    ipcRenderer.on(SEND_FROM_TOUCHBAR_EVENT, this.handleSendFromTouchBar);

    window.addEventListener('keydown', this.handleKeyDown);
  }

  public componentDidUpdate(prevProps: any, prevState: ContainerState) {
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

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  public setColorFromStorage(): void {
    storage.getAll((error: any, data: any) => {
      if (error) {
        return;
      }

      for (const device in data.devices) {
        if (!device) {
          continue;
        }

        const { shortName, hex } = data.devices[device];

        this.sendLightingMessage(shortName, hex);
      }

      if (data.hex) {
        this.setState({
          hex: data.hex,
        });
      }
    });
  }

  public setDevices = (devices: FRDevice[] = []): void => {
    this.setState({
      devices: devices.filter((device) => device.connected),
    });
  }

  public handleCloseClick = (): void => {
    ipcRenderer.send(CLOSE_WINDOW_EVENT);
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
    this.sendLightingMessage(shortName);
  }

  public handleInputChange = (hex: string): void => {
    this.setState({
      hex,
    });
  }

  public handleKeyDown = (event: KeyboardEvent): void => {
    if (
      event.repeat === false &&
      event.key === 'Enter' &&
      event.metaKey === true
    ) {
      this.handleSave();
    }
  }

  public handleSave = (): void => {
    const { devices, hex } = this.state;

    const data: Record<string, { shortName: string, hex: string }> = {};

    devices.forEach(({ shortName }: FRDevice) => {
      data[shortName] = { shortName, hex };
    });

    storage.set('devices', data);
    storage.set('hex', hex);

    devices.forEach(({ shortName }) => {
      this.sendLightingMessage(shortName);
    });
  }

  public handleSendFromTouchBar = (): void => {
    this.handleSave();
  }

  public handleSetColorFromTouchBar = (event: Event, hex: string): void => {
    this.handleColorChange({ hex });
  }

  public sendLightingMessage(shortName: string, hex: string = this.state.hex): void {
    const postData = getPostDataForDevice(shortName, hex);

    FruityRazer.sendLightingMessage(shortName, postData);
  }

  public render() {
    const { devices, hex } = this.state;

    return (
      <div
        className={styles.container}
        ref={this.containerRef}
      >
        <div className={styles.content}>

          <div className={styles.close} onClick={this.handleCloseClick}>
            <Close />
          </div>

          <h2>Devices</h2>

          <Devices
            devices={devices}
            onDeviceClick={this.handleDeviceClick}
            onSetDevices={this.setDevices}
          />

        </div>

        <ColorPicker onChange={this.handleColorChange} color={`#${hex}`} />

        <div className={styles.footer}>

          <Input
            hex={hex}
            key={hex}
            onChange={this.handleInputChange}
          />

          <Button onClick={this.handleSave} text="Update All" />

          <div className={styles.settings} onClick={this.handleContextMenu}>
            <Settings />
          </div>
        </div>
      </div>
    );
  }
}
