import React, { Component } from 'react';
import styles from './image-preview-upload.module.scss';
interface ImagePreviewUploadPropsType {
  value?: any;
  onChange?: any;
  btnLabel?: string;
}

export class ImagePreviewUpload extends Component<ImagePreviewUploadPropsType, any> {
  inputRef: any;
  constructor(props: any) {
    super(props);
    this.inputRef = React.createRef();
  }
  handleUploadImage = (e: any) => {
    const { onChange } = this.props;
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    onChange({
      image_url: imageUrl,
      uploadFile: imageUrl
    });

    // URL.revokeObjectURL(e.target.files[0]);
  };

  handleImageClick = () => {
    this.inputRef.current.click();
  }; 
  
  render() {
    const { value, btnLabel } = this.props;
    return (
      <div className="com-preview-upload-image">
        <div className="com-preview-image" onClick={this.handleImageClick}>
          <input
            type="file"
            accept="image/*"
            className={styles['hide-input']}
            onChange={this.handleUploadImage}
            ref={this.inputRef}
          />
          {value ? (
            value.image_url === "https://belooga-dev.s3.amazonaws.com/media/job_default.png" || value.image_url === "https://belooga-dev.s3.amazonaws.com/media/school_default.png" ? (
              <div className="file-inner">
              <i className={`com-icon-camera`} />
              <span>{btnLabel ? btnLabel : 'Add logo'}</span>
            </div>
            ) : (
              <img className="com-image-logo" src={value.image_url}/>
            )
          ) : (
            <div className="file-inner">
              <i className={`com-icon-camera`} />
              <span>{btnLabel ? btnLabel : 'Add logo'}</span>
            </div>
          )}
          <div className='com-preview-image-hover'>
          <i className="fas fa-pen"/>
          </div>
        </div>
      </div>
    );
  }
}
