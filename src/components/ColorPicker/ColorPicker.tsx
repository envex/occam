import * as React from 'react';
import { CustomPicker } from 'react-color';
import { Hue, Saturation } from 'react-color/lib/components/common';

import {
  ColorPickerPointer,
  ColorPickerSlider,
} from 'components/ColorPicker/ColorPickerPointer';

import styles from './ColorPicker.module.scss';

class ColorPicker extends React.PureComponent {
  public render() {
    // TODO: The types here are whack
    // @ts-ignore
    const { onChange } = this.props;

    return (
      <div className={styles.container}>

        <div className={styles.saturation}>
          <Saturation
            {...this.props}
            onChange={onChange}
            pointer={ColorPickerPointer}
          />
        </div>

        <div className={styles.hue}>
          <Hue
            {...this.props}
            onChange={onChange}
            pointer={ColorPickerSlider}
          />
        </div>
      </div>
    );
  }
}

export default CustomPicker(ColorPicker);
