import React, { Component } from 'react';
import styles from './image-with-button.module.scss';

interface ImageWithButtonPropTypes {
  src: string;
  btnText?: string;
  handleBtnClick?: any;
  imgWidth?: number;
  imgHeight?: number;
  shape: 'round' | 'square';
  value?: any;
  isFormControl?: any;
  canEdit: boolean;
}

export class ImageWithButton extends Component<ImageWithButtonPropTypes> {
  render() {
    const {
      src,
      handleBtnClick,
      imgWidth = 50,
      imgHeight = 50,
      shape,
      value,
      isFormControl = false,
      canEdit = true
    } = this.props;
    const _imgStyles = {
      borderRadius: shape === 'round' ? imgWidth / 2 : 0
    };
    const _iconStyles = {
      right: imgWidth / 2 - 10,
      bottom: imgWidth / 2
    };
    return canEdit ? (
      <div className={styles['wrapper']}>
        <img
          src={isFormControl ? value : src}
          width={imgWidth}
          height={imgHeight}
          style={_imgStyles}
          onClick={handleBtnClick}
          className="no-margin-bottom"
        />
        <i className="fas fa-pen" style={_iconStyles} onClick={handleBtnClick} />
      </div>
    ) : (
      <div className={styles['wrapper']}>
        <img
          src={isFormControl ? value : src}
          width={imgWidth}
          height={imgHeight}
          style={_imgStyles}
          className={`no-margin-bottom ${styles['public-image']}`}
        />
      </div>
    );
  }
}
