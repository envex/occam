import cx from 'classnames';
import React from 'react';

import styles from './ColorPicker.module.scss';

interface ColorPickerPointerProps {
  hsl: any;
}

export const ColorPickerPointer: React.SFC<ColorPickerPointerProps> = (props) => {
  const h = Math.round(props.hsl.h);
  const s = Math.round(props.hsl.s * 100);
  const l = Math.round(props.hsl.l * 100);

  const style = {
    backgroundColor: `hsl(${h}, ${s}%, ${l}%)`,
  };

  return <div className={styles.pointer} style={style} />;
};

interface ColorPickerSliderProps {
  hsl: any;
}

export const ColorPickerSlider: React.SFC<ColorPickerSliderProps> = (props) => {
  const style = {
    backgroundColor: `hsl(${Math.round(props.hsl.h)}, 100%, 50%)`,
  };

  const classes = cx(styles.pointer, styles.pointer__is_slider);

  return <div className={classes} style={style} />;
};
