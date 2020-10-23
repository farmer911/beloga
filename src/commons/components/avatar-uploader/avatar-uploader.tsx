import React, { Component } from 'react';
import { Avatar } from '../react-avatar-edit/react-avatar-edit';
import styles from './avatar-uploader.module.scss';

interface AvatarUploaderPropTypes {
  src: string;
  preview?: any;
  onCrop: any;
  onClose: any;
  onSubmit: any;
}

export class AvatarUploader extends Component<AvatarUploaderPropTypes> {
  constructor(props: AvatarUploaderPropTypes) {
    super(props);
  }

  render() {
    const { src, onCrop, onClose, onSubmit, preview } = this.props;
    const disabledSubmit = !preview ? 'disabled' : '';
    return (
      <React.Fragment>
        <h3 className="com-form-title">Edit Avatar</h3>
        <div className={` ${styles['wrapper']}`}>
          <div className={` ${styles['avatar-wrapper']}`}>
            <Avatar width={'auto'} height={295} onCrop={onCrop} onClose={onClose} src={src} />
          </div>
          <div className="text-center submit-form-group">
            <a className={`btn-save-form ${disabledSubmit}`} href="#" onClick={onSubmit}>
              <span className="btn__text">Apply</span>
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
