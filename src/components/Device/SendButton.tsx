import cx from 'classnames';
import * as React from 'react';

import { Chevron } from '../Icons';

import styles from './Device.module.scss';

interface SendButtonProps {
  onClick: () => void;
}

interface SendButtonState {
  isSending: boolean;
}

export default class SendButton extends React.PureComponent<
  SendButtonProps, SendButtonState
> {

  public state = {
    isSending: false,
  };

  public handleClick = () => {
    const { onClick } = this.props;

    onClick();

    this.setState({
      isSending: true,
    });

    setTimeout(() => {
      this.setState({
        isSending: false,
      });
    }, 1000);
  }

  public render() {
    const { isSending } = this.state;

    const classes = cx(
      styles.send_button, {
        [styles.send_button__is_sending]: isSending,
      },
    );

    return (
      <button
        className={classes}
        onClick={this.handleClick}
        title="Send to Single Device"
      >
        <Chevron />
      </button>
    );
  }
}
