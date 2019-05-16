import * as React from 'react';

import { Settings } from 'components/Icons';

import styles from './EmptyView.module.scss';

interface EmptyViewProps {
  onClick: () => void;
}

const EmptyView: React.SFC<EmptyViewProps> = ({ onClick }) => {
  return (
    <div className={styles.container}>
      <span className={styles.logo} />

      <h2>Please connect a device.</h2>

      <p className={styles.text}>
        We could not find a compatible device.
        This either means the app is having an issue finding devices,
        or the current device(s) are not compatiable.
      </p>

      <div className={styles.settings} onClick={onClick}>
        <Settings />
      </div>

    </div>
  );
};

export default EmptyView;
