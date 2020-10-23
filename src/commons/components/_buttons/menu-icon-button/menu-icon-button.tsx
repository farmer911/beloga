import React from 'react';
import styles from './menu-icon-button.module.scss';

interface IconButtonPropTypes {
  iconClass: string;
  buttonName: string;
  className?: string;
  dataName?: string;
}

export const IconButton = (props: IconButtonPropTypes) => {
  const { iconClass, buttonName, className, dataName } = props;
  return (
    <div className={`align-items-center ${styles['contain']} ${className}`}>
      <i className={`${iconClass} ${styles['size-icon']}`} />
      <span data-name={`data-${dataName}`} className="icon-button-text">{buttonName}</span>
    </div>
  );
};
