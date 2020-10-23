import React from 'react';
import styles from './chip.module.scss';
export const Chip = (props: any) => {
  return (
    <div className={`${styles['chip']} ${styles['chip-hover']}`}>
      <span className={styles['chip-icon']} onClick={props.handleIconClick}>
        x
      </span>
      {props.text}
    </div>
  );
};
