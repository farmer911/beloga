import React from 'react';
import styles from './checkbox.module.scss';

export const Checkbox = ({ label, ...restProps }: any) => {
  return (
    <div className="form-inline">
      <div className="input-checkbox no-margin-top">
        <input className={styles['input']} type="checkbox" {...restProps} />
        <label className="no-margin-top" />
      </div>
      <div className={styles['label']}>{label}</div>
    </div>
  );
};
