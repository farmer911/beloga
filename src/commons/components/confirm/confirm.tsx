import React, { Component } from 'react';
import styles from './confirm.module.scss';

interface ConfirmPropTypes {
  message: string;
  hasOk?: boolean;
  hasCancel?: boolean;
  actionOk?: any;
  actionCancel?: any;
}
export class Confirm extends Component<ConfirmPropTypes, any> {
  render() {
    const { message, actionOk, actionCancel, hasCancel = true } = this.props;
    return (
      <div className={`confirm-content col-12 ${styles['content-confirm']}`}>
        <p className={styles['message']}>{message}</p>
        <div className="confirm-button d-flex flex-row justify-content-center">
          <a
            className={`btn btn-ok type--uppercase ${styles['confirm-button']} ${styles['no-margin-bottom']}`}
            onClick={actionOk}
          >
            Ok
          </a>
          {hasCancel ? (
            <a className={`btn btn-cancel type--uppercase ${styles['cancel-button']}`} onClick={actionCancel}>
              Cancel
            </a>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
