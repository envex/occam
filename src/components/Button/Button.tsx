import React from 'react';

import styles from './Button.module.css';

interface ButtonProps {
  onClick: () => void;
  text: string;
}

export const Button: React.SFC<ButtonProps> = (props) => {
  const { onClick, text } = props;

  return (
    <button className={styles.button} onClick={onClick}>
      {text}
    </button>
  );
};
