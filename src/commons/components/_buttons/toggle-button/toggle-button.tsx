import React from 'react';
import styles from './toggle-button.module.scss';

interface ToggleButtonPropTypes {
  handleToggle?: any;
  isChecked?: boolean;
}

export const ToggleButton = (props: ToggleButtonPropTypes) => (
  <label className={`toggle-input-group ${styles['input-toggle']}`}>
    <input type="checkbox" style={{ maxWidth: 5 }} checked={props.isChecked} onChange={props.handleToggle} /> <span />
  </label>
);
