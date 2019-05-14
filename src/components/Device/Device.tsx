import cx from 'classnames';
import * as React from 'react';

import { FRDevice } from 'app';

import styles from './Device.module.css';

interface DeviceProps {
  device: FRDevice;
  isSelected: boolean;
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
    const {
      device: { fullName },
      isSelected,
    } = this.props;

    const classes = cx(styles.dot, {
      [styles.dot__is_selected]: isSelected,
    });

    return (
      <a onClick={this.handleClick} className={styles.container}>
        {fullName}

        <span className={classes} />
      </a>
    );
  }
}
