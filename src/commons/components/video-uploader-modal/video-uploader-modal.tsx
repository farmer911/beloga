import React, { Component, Fragment } from 'react';
import { Reducer } from 'redux';
import { createUploadFileChannel, getApiPath } from '../../../utils';
import { ApiPaths, HttpCodes, videoConfig } from '../../../commons/constants';
import axios from 'axios';
import styles from './video-uploader-modal.module.scss';

import { VideoPlayer } from '../video-player/video-player';
import { Modal } from '../modal/modal';
import { Alert } from '../alert/alert';
import Upload from 'rc-upload';
import { LoadingIcon } from '../loading-icon/loading-icon';

import { VideoRecord } from '../video-record/video-record';
import { confirmAlert } from 'react-confirm-alert';
import RecordRTC from 'recordrtc';
import { getUserInfoAction } from '../../../ducks/user.duck';
import { timeout } from 'q';

interface VideoUploaderModalPropsType {
  toggleModal: any;
  isOpen: any;
  data: any;
  userInfo: any;
  uploadType: any;
  authorizationHeaders?: any;
  getUserInfo?: any;
  isLoadingGetUserInfo?: boolean;
  LoadingComponent?: any;
  hasVideo?: boolean;
  removeVideo?: any;
  handleupdateUserStatusOpportunity?:any;
}

export class UploadVideoWindow extends Component<VideoUploaderModalPropsType> {
  loopAction: any;
  fileSizeLimit = 104857600; // 100MB
  state = {
    percent: '0%',
    notify: '',
    video: File,
    preview: {
      title: 'Preview video',
      videoSource: '',
      showTitle: false,
      backgroundImage: '',
      imageCover: '',
      uploadType: ''
    },
    progressUploadVideo: 0,
    success: false,
    failed: false,
    coverImage: {
      image: File,
      progressUploadImage: 0,
      notify: '',
      success: false,
      failed: false
    },
    isProgressingImage: false,
    videoUploadedStatus: true,
    isProgressingVideo: false,
    isRecordVideoScreen: false,
    recordVideoStarting: false,
    isRecordVideoResult: false
  };
  constructor(props: any) {
    super(props);
  }

  selectVideoUpload = () => {};
  selectImageUpload = () => {};

  componentWillReceiveProps(nextProps: any) {
    const { data } = nextProps;
    if (nextProps !== this.props) {
      this.setState({
        preview: {
          title: 'preview',
          videoSource: data.videoSource,
          showTitle: false,
          backgroundImage: data.backgroundImage
        }
      });
    }
  }

  fileOptions = {
    multiple: false,
    component: 'div',
    action: this.selectVideoUpload(),
    headers: {},
    accept: 'video/*',
    onStart: (file: any) => {
      
    },
    onProgress: ({ percent }: any, file: any) => {},
    onSuccess: (ret: any) => {},
    onError(err: any) {},
    beforeUpload: (file: any, fileList: any) => {
      this.setState({
        notify: '',
        isRecordVideoScreen: false
      });

      URL.revokeObjectURL(this.state.preview.videoSource);
      if (file.type.split('/')[0] === 'video') {
        if (file.size > this.fileSizeLimit) {
          this.setState({
            notify: 'File size cannot be bigger than 100 MB'
          });
          return;
        }

        const video = document.createElement('video');
        video.src = window.URL.createObjectURL(file);
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          const duration = video.duration;
          if (duration > 40) {
            this.setState({
              notify: 'Error. Video exceeds 40 seconds'
            });
          }
        };

        this.setState({
          percent: '0%',
          progressUploadVideo: 0,
          notify: '',
          success: false,
          failed: false,
          video: file,
          uploadType: this.props.uploadType
        });
        const validFormat = ['mp4', 'webm'];
        if (validFormat.indexOf(file.type.split('/')[1]) !== -1) {
          this.setState({
            preview: {
              title: 'preview',
              videoSource: URL.createObjectURL(file),
              showTitle: false,
              backgroundImage: this.state.preview.backgroundImage ? this.state.preview.backgroundImage : ''
            }
          });
        }

        const { data } = this.props;
        return new Promise(resolve => {
          resolve(file);
        });
      }
      this.setState({
        notify: 'The upload must be video type.'
      });
      return false;
    },
    customRequest({ action, data, file, headers, onError, onProgress, onSuccess, withCredentials }: any) {}
  };

  onSubmitCoverImage = () => {
    this.setState({ isProgressingImage: true });
    const { getUserInfo, uploadType, authorizationHeaders } = this.props;
    const formData = new FormData();
    const fileData: any = this.state.coverImage.image;
    let path = '';
    if (uploadType === 'resume') {
      formData.append('cover_image', fileData);
      path = ApiPaths.UPLOAD_VIDEO_COVER;
    } else if (uploadType === 'experience') {
      formData.append('job_cover_image', fileData);
      path = ApiPaths.UPLOAD_VIDEO_EXPERIENCE_COVER;
    } else if (uploadType === 'education') {
      formData.append('school_cover_image', fileData);
      path = ApiPaths.UPLOAD_VIDEO_EDUCATION_COVER;
    }
    const headers = { ...authorizationHeaders };
    axios
      .patch(getApiPath(path), formData, {
        headers: headers,
        onUploadProgress: (e: ProgressEvent) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            this.setState({ coverImage: { progressUploadImage: progress } });
          }
        }
      })
      .then((res: any) => {
        getUserInfo();
        setTimeout(() => {
          this.setState({ coverImage: { success: true }, isProgressingImage: false });
        }, 3000);
        setTimeout(() => {
          this.setState({ coverImage: { success: false } });
        }, 10000);
      })
      .catch(err => {
        this.setState({
          coverImage: { failed: true, notify: 'Error when upload cover image.' },
          isProgressingImage: false
        });
      });
  };

  fileImageOptions = {
    multiple: false,
    component: 'div',
    action: this.selectImageUpload(),
    headers: {},
    accept: 'image/jpeg, image/png',
    onStart: (file: any) => {
      this.onSubmitCoverImage();
    },
    onProgress: ({ percent }: any, file: any) => {},
    onSuccess: (ret: any) => {},
    onError(err: any) {},
    beforeUpload: (file: any, fileList: any) => {
      this.setState({
        coverImage: { notify: '' }
      });
      if (file.type.split('/')[0] === 'image') {
        this.setState({
          coverImage: {
            image: file
          }
        });
        const fileSize = 5242880;
        if (file.size > fileSize) {
          this.setState({ coverImage: { notify: 'Maximum file size is 5MB' } });
          return false;
        }
        return new Promise(resolve => {
          resolve(file);
        });
      }
      this.setState({
        coverImage: { notify: 'The upload must be image type.' }
      });
      return false;
    },
    customRequest({ action, data, file, headers, onError, onProgress, onSuccess, withCredentials }: any) {}
  };

  handleOpenUploadVideoModal = () => {
    const { recordVideoStarting } = this.state;
    if (recordVideoStarting) {
      return this.confirmCloseVideoRecording();
    }

    const { video, preview, isProgressingVideo, videoUploadedStatus, progressUploadVideo } = this.state;
    this.setState({ isRecordVideoScreen: false });
    if (progressUploadVideo > 0 && progressUploadVideo < 100) {
      //console.log('Uploading');
    } else if (isProgressingVideo && !videoUploadedStatus) {
      this.confirmVideoProgressing();
    } else if (!isProgressingVideo && videoUploadedStatus) {
      const { toggleModal, isOpen } = this.props;
      this.setState({
        success: false,
        percent: '0%',
        notify: '',
        progressUploadVideo: 0,
        video: isOpen ? undefined : video,
        preview: isOpen
          ? {
              title: 'Preview video',
              videoSource: '',
              showTitle: false,
              backgroundImage: '',
              imageCover: ''
            }
          : {
              title: 'Preview video',
              videoSource: '',
              showTitle: false,
              backgroundImage: '',
              imageCover: ''
            },
        coverImage: {
          success: false,
          progressUploadImage: 0,
          failed: false,
          notify: ''
        }
      });

      toggleModal();
    }
  };

  closeUploadVideoModal = () => {
    const { toggleModal, getUserInfo, uploadType } = this.props;
    if (uploadType === 'resume') {
      localStorage.setItem('resume_video_progressing', 'yes');
    } else if (uploadType === 'experience') {
      localStorage.setItem('experience_video_progressing', 'yes');
    } else if (uploadType === 'education') {
      localStorage.setItem('education_video_progressing', 'yes');
    }
    getUserInfo();
    toggleModal();
  };

  closeModalFromRecord = () => {
    const { toggleModal, getUserInfo } = this.props;
    const { isProgressingVideo, videoUploadedStatus } = this.state;
    if (isProgressingVideo && !videoUploadedStatus) {
      this.confirmVideoProgressing();
    }
    this.setState({ isRecordVideoScreen: false });
    getUserInfo();
    toggleModal();
  };

  confirmVideoProgressing = () => {
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>
            <p className="confirm-message">Video is uploading. We will notify you when complete.</p>
            <div className="confirm-button">
              <a
                onClick={() => {
                  this.closeUploadVideoModal();
                  onClose();
                }}
                className="confirm-ok-button"
              >
                Ok
              </a>
              {/* <a onClick={onClose} className="confirm-cancel-button">
                Cancel
              </a> */}
            </div>
          </div>
        );
      }
    });
  };

  confirmCloseVideoRecording = () => {
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>
            <p className="confirm-message">Video is recording. Do you want to close window?</p>
            <div className="confirm-button">
              <a
                onClick={() => {
                  this.closeModalFromRecord();
                  onClose();
                }}
                className="confirm-ok-button"
              >
                Ok
              </a>
              <a onClick={onClose} className="confirm-cancel-button">
                Cancel
              </a>
            </div>
          </div>
        );
      }
    });
  };

  onProgressVideo = (uploadType: string, headers: any) => {
    const { getUserInfo } = this.props;
    this.loopAction = window.setInterval(() => {
      this.getVideoUploadStatus(uploadType, headers);
      if (this.state.videoUploadedStatus) {
        clearInterval(this.loopAction);
        getUserInfo();
        setTimeout(() => {
          this.setState({ isProgressingVideo: false, success: true, progressUploadVideo: 0, video: undefined });
        }, 2000);
        setTimeout(() => {
          this.setState({ success: false });
        }, 10000);
      }
    }, 5000);
  };
  onSubmitVideo = (video: any) => {
    this.setState({ isRecordVideoScreen: false, videoUploadedStatus: false });
    const { getUserInfo, uploadType, authorizationHeaders } = this.props;
    const formData = new FormData();
    const fileData: any = video;
    let path = '';
    if (uploadType === 'resume') {
      formData.append('video', fileData);
      path = ApiPaths.UPLOAD_VIDEO;
    } else if (uploadType === 'experience') {
      formData.append('job_video', fileData);
      path = ApiPaths.UPLOAD_VIDEO_EXPERIENCE;
    } else if (uploadType === 'education') {
      formData.append('school_video', fileData);
      path = ApiPaths.UPLOAD_VIDEO_EDUCATION;
    }
    const headers = { ...authorizationHeaders };
    axios
      .patch(getApiPath(path), formData, {
        headers: headers,
        onUploadProgress: (e: ProgressEvent) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            this.setState({ progressUploadVideo: progress });
          }
        }
      })
      .then((res: any) => {
        this.setState({ isProgressingVideo: true, videoUploadedStatus: false });
        // this.handleOpenUploadVideoModal();
        if (uploadType === 'resume' && !res.video_uploaded) {
          this.onProgressVideo(uploadType, headers);
        } else if (uploadType === 'experience' && !res.job_video_uploaded) {
          this.onProgressVideo(uploadType, headers);
        } else if (uploadType === 'education' && !res.school_video_uploaded) {
          this.onProgressVideo(uploadType, headers);
        } else {
          getUserInfo();
          setTimeout(() => {
            this.setState({ isProgressingVideo: false, success: true, progressUploadVideo: 0, video: undefined });
          }, 2000);
          setTimeout(() => {
            this.setState({ success: false });
          }, 10000);
        }
      })
      .catch(err => {
        this.setState({ failed: true });
        this.setState({
          notify: 'Network error when upload video.',
          videoUploadedStatus: true,
          isProgressingVideo: false
        });
      });
  };

  onSaveArchive = (archiveData: any) => {
    const { uploadType, authorizationHeaders } = this.props;
    let path = '';
    path = ApiPaths.OPENTOK_SAVE_ARCHIVE;
    if (uploadType === 'resume') {
      archiveData.video_type = 'video';
    } else if (uploadType === 'experience') {
      archiveData.video_type = 'job_video';
    } else if (uploadType === 'education') {
      archiveData.video_type = 'school_video';
    }
    const headers = { ...authorizationHeaders };
    axios
      .post(getApiPath(path), archiveData, {
        headers: headers
      })
      .then((res: any) => {})
      .catch(err => {});
  };

  getVideoUploadStatus(uploadType: string, headers: any) {
    const path = ApiPaths.PROFILE_VIDEO_STATUS;
    axios
      .get(getApiPath(path), {
        headers: headers
      })
      .then((res: any) => {
        this.setState({ videoUploadedStatus: false });
        const userProfile = res.data;
        if (uploadType === 'resume' && userProfile.video_uploaded) {
          this.setState({ videoUploadedStatus: true });
        } else if (uploadType === 'experience' && userProfile.job_video_uploaded) {
          this.setState({ videoUploadedStatus: true });
        } else if (uploadType === 'education' && userProfile.school_video_uploaded) {
          this.setState({ videoUploadedStatus: true });
        }
      })
      .catch(err => {});
  }

  openRecordVideo = () => {
    const { isRecordVideoScreen, isProgressingVideo, isRecordVideoResult, videoUploadedStatus } = this.state;
    if (
      videoUploadedStatus &&
      ((!isProgressingVideo && !isRecordVideoScreen) || (isRecordVideoScreen && isRecordVideoResult))
    ) {
      this.setState({ isRecordVideoScreen: true, isRecordVideoResult: false });
    }
  };
  startRecordVideo = (status: boolean) => {
    this.setState({ recordVideoStarting: status });
  };
  onClickQuestion = () => {
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>
            <p className="confirm-message">Preview only available for .mp4 and webm</p>
            <div className="confirm-button">
              <a onClick={onClose} className="confirm-ok-button">
                Ok
              </a>
            </div>
          </div>
        );
      }
    });
  };

  renderVideoName = () => {
    const { video } = this.state 
    if (video.name.length > 40) {
      let name = video.name.slice(0, 40) + '...';
      return name;
    }
  }

  confirmArchive = (archiveData: any) => {
    const { uploadType, authorizationHeaders } = this.props;
    let path = '';
    path = ApiPaths.OPENTOK_CONFIRM_ARCHIVE;
    const headers = { ...authorizationHeaders };
    axios
      .post(getApiPath(path), archiveData, {
        headers: headers
      })
      .then((res: any) => {})
      .catch(err => {});
  };
  confirmArchiveAction = (archiveData: any) => {
    if (archiveData.confirm === 'yes') {
      setTimeout(() => {
        // this.confirmVideoProgressing();
        this.confirmArchive(archiveData);

        const { uploadType, authorizationHeaders } = this.props;
        const headers = { ...authorizationHeaders };
        const { getUserInfo } = this.props;
        this.setState({
          isRecordVideoScreen: false,
          isRecordVideoResult: true,
          isProgressingVideo: true,
          success: false,
          videoUploadedStatus: false,
          progressUploadVideo: 100,
          video: undefined
        });
        this.loopAction = window.setInterval(() => {
          this.getVideoUploadStatus(uploadType, headers);
          if (this.state.videoUploadedStatus) {
            clearInterval(this.loopAction);
            getUserInfo();
            setTimeout(() => {
              this.setState({ isProgressingVideo: false, progressUploadVideo: 0, success: true });
            }, 2000);
            setTimeout(() => {
              this.setState({ success: false });
            }, 10000);
          }
        }, 3000);
      }, 1000);
    } else {
      this.confirmArchive(archiveData);
    }
  };

  render() {
    const {
      notify,
      preview,
      video,
      progressUploadVideo,
      success,
      failed,
      coverImage,
      isRecordVideoScreen,
      isProgressingVideo,
      videoUploadedStatus,
      isRecordVideoResult,
      recordVideoStarting
    } = this.state;
    const { isOpen, LoadingComponent, isLoadingGetUserInfo, hasVideo, removeVideo, handleupdateUserStatusOpportunity } = this.props;
    const percent = `${Math.round(progressUploadVideo).toFixed(2)}%`;
    let disableSelected = !videoUploadedStatus;
    if (!disableSelected && recordVideoStarting) {
      disableSelected = true;
    }
    let disableWhenUpload = !video || (video && (video.name === 'File' || video.name === '')) ? true : false;
    if (!disableWhenUpload && disableSelected) {
      disableWhenUpload = true;
    }
    let disableImageSelected =
      coverImage.progressUploadImage > 0 && coverImage.progressUploadImage < 100 ? true : false;
    if (!disableImageSelected && (progressUploadVideo > 0 && progressUploadVideo < 100)) {
      disableImageSelected = true;
    }
    if (!disableImageSelected && isLoadingGetUserInfo) {
      disableImageSelected = true;
    }
    if (success){
      handleupdateUserStatusOpportunity({ status_opportunity: success })
    }

    const videoJsOptions = {
      controls: true,
      width: 720,
      height: 480,
      fluid: true,
      plugins: {
        record: {
          image: false,
          audio: true,
          video: true,
          maxLength: 40,
          debug: true,
          videoMimeType: 'video/webm'
        }
      }
    };

    return (
      <Modal isOpen={isOpen} toggleModal={this.handleOpenUploadVideoModal} className="video-uploader-modal">
        <div className={`container modal-upload-video`}>
          <div className={`row justify-content-center`}>
            <div className="header-video-block col-md-12">
              <h5 className="video-modal-title">Upload Video</h5>
              <div className="custom-uploader-video">
                <div className="row text-center">
                  <div className="col-12 col-md-6">
                    <Upload {...this.fileOptions} className={styles['none-focus']} disabled={disableSelected}>
                      <a className="btn-select-video">
                        <span className="upload-icon">
                          <i className="iconn-upload-video" />
                        </span>
                        <span className="upload-text">Select your video</span>
                      </a>
                    </Upload>
                  </div>
                  <div className="col-12 col-md-6 sm-margin-top-20">
                    <a className="btn-record-video" onClick={this.openRecordVideo}>
                      <span className="record-icon">
                        <i className="iconn-record-video" />
                      </span>
                      <span className="record-text">Record your video</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isRecordVideoScreen ? (
            <div className="row">
              <div className="col-md-12">
                <div className="filename-progress-label">
                  <div className="filename-col">
                    {video && video.name !== 'File' ? <p className="video-block__name">{this.renderVideoName()}</p> : null}
                  </div>
                  <div className="progress-col">
                    <span className="progress-horizontal__label">Progress: {percent}</span>
                  </div>
                </div>
                <div className="progress-horizontal progress-horizontal--sm">
                  <div className={`progress-horizontal__bar ${disableSelected}`} data-value="20">
                    <div className="progress-horizontal__progress" style={{ width: percent }} />
                  </div>
                  {success ? <Alert type="success" message="Video uploaded successfully!" /> : null}
                  {notify ? <Alert type="alert" message={notify} /> : null}
                </div>
                <div className="modal-submit-button">
                  <a
                    className={`btn btn-upload-video ${disableWhenUpload ? 'disabled' : null} ${
                      notify ? 'disabled' : null
                    }`}
                    onClick={() => this.onSubmitVideo(this.state.video)}
                  >
                    Upload
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          {isRecordVideoScreen ? (
            <div className="row">
              {isRecordVideoResult ? (
                isProgressingVideo ? (
                  <div className="col-md-12 video-record-block">
                    <div className="no-preview-video">
                      <div className="no-preview-inner">{LoadingComponent}</div>
                    </div>
                  </div>
                ) : preview && preview.videoSource ? (
                  <div className="col-md-12 video-record-block results">
                    {success ? <Alert type="success" message="Updated video successfully!" /> : null}
                    <VideoPlayer isShowLogo={false} data={preview} height={videoConfig.height} />
                  </div>
                ) : null
              ) : (
                <div className="col-md-12 video-record-block">
                  <VideoRecord
                    {...videoJsOptions}
                    isRecordVideoScreen={isRecordVideoScreen}
                    openUploadVideo={this.props.isOpen}
                    saveArchiveAction={this.onSaveArchive}
                    startRecordVideo={this.startRecordVideo}
                    confirmArchiveAction={this.confirmArchiveAction}
                    authorizationHeaders={this.props.authorizationHeaders}
                    LoadingComponent={LoadingComponent}
                  />
                </div>
              )}
            </div>
          ) : null}

          {!isRecordVideoScreen ? (
            <Fragment>
              <div className="row">
                <div className="col-md-12">
                  <div className="preview-video-group">
                    <h5 className="preview-video-title">Preview Video</h5>
                    <i
                      className="fa fa-question-circle"
                      onClick={this.onClickQuestion}
                      style={{ color: '#39a0e8', marginLeft: 10, fontSize: 16 }}
                    />
                    {hasVideo ? (
                      <a onClick={removeVideo} className="remove-video-button">
                        <span>Remove video</span>
                      </a>
                    ) : null}
                  </div>
                  {isProgressingVideo ? (
                    <div className="no-preview-video">
                      <div className="no-preview-inner">{LoadingComponent}</div>
                    </div>
                  ) : preview && preview.videoSource ? (
                    <VideoPlayer
                      isResetVideo={false}
                      isShowLogo={false}
                      closeVideo={!isOpen}
                      data={preview}
                      height={videoConfig.height}
                    />
                  ) : (
                    <div className="no-preview-video">
                      <div className="no-preview-inner">
                        <img src="/images/logo-big.png" />
                        <span>The Video Resume</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h5 className="preview-cover-title">Cover Image</h5>
                  <div className="preview-cover-line">
                    <div className="preview-cover-image">
                      {this.state.isProgressingImage ? (
                        <div className="preview-image-loading">{LoadingComponent}</div>
                      ) : (
                        <div className="preview-image">
                          {preview && preview.backgroundImage ? (
                            <img src={preview.backgroundImage} />
                          ) : (
                            <span>No cover image</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="preview-cover-upload">
                      <Upload {...this.fileImageOptions} disabled={disableImageSelected}>
                        <a className="btn-upload-cover-image">Custom Cover Image</a>
                      </Upload>
                      <span className="note-message">Maximum file size is 5MB</span>
                    </div>
                  </div>
                  {coverImage.success ? <Alert type="success" message="Upload cover image successfully!" /> : null}
                  {coverImage.notify ? <Alert type="alert" message={coverImage.notify} /> : null}
                </div>
              </div>
            </Fragment>
          ) : null}
        </div>
      </Modal>
    );
  }
}
