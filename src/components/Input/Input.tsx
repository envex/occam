import cx from 'classnames';
import * as React from 'react';
// @ts-ignore no type for isValidHex
import { isValidHex } from 'react-color/lib/helpers/color';

import styles from './Input.module.scss';

interface InputProps {
  hex: string;
  onChange: (hex: string) => void;
}

interface InputState {
  hex: string;
  isHexValid: boolean;
}

export default class Input extends React.Component<InputProps, InputState> {

  public state = {
    hex: this.props.hex,
    isHexValid: true,
  };

  public inputRef = React.createRef<HTMLInputElement>();

  public handleBlur = (event: React.FormEvent): void => {
    const { hex: originalHex, onChange } = this.props;

    const hex = this.formatHex((event.target as HTMLInputElement).value);

    if (!isValidHex(hex)) {
      this.setState({
        hex: originalHex,
      });

      return;
    }

    onChange(hex);
  }

  public handleChange = (event: React.FormEvent): void => {
    const hex = this.formatHex((event.target as HTMLInputElement).value);

    this.setState({
      hex,
      isHexValid: isValidHex(hex),
    });
  }

  public handleKeyUp = (event: React.KeyboardEvent): void => {
    const { onChange } = this.props;

    if (event.key === 'Escape' && this.inputRef.current) {
      return this.inputRef.current.blur();
    }

    if (event.key !== 'Enter') {
      return;
    }

    const hex = this.formatHex((event.target as HTMLInputElement).value);

    if (!isValidHex(hex)) {
      return;
    }

    onChange(hex);
  }

  public formatHex(hex: string): string {
    return hex.replace(/[^a-z0-9]+$/gi, '');
  }

  public render() {
    const { hex, isHexValid } = this.state;

    const classes = cx(
      styles.input, {
        [styles.input__is_valid]: isHexValid,
        [styles.input__is_invalid]: !isHexValid,
      },
    );

    return (
      <input
        className={classes}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
        ref={this.inputRef}
        type="text"
        value={hex}
      />
    );
  }
}
