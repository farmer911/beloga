import React from 'react';
import styles from './loading-icon.module.scss';

interface LoadingIconPropTypes {
  size?: number;
  color?: string;
  isShow?: boolean;
}

export const LoadingIcon = (props: LoadingIconPropTypes) => {
  const { size, color, isShow = true } = props;
  return (
    <svg
      display={isShow ? 'initial' : 'none'}
      color={'white'}
      className={styles['spinner']}
      width={size || 20}
      height={size || 20}
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={styles['path']}
        stroke={color || 'white'}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      />
    </svg>
  );
};
