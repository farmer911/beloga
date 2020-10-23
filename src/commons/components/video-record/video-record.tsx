import React, { Component, Fragment } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { createUploadFileChannel, getApiPath } from '../../../utils';
import { ApiPaths, HttpCodes } from '../../../commons/constants';
import axios from 'axios';

import { Alert } from '../alert/alert';

import '@opentok/client';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

const apiKey = process.env.REACT_APP_OPENTOK_API_KEY;
const apiSecret = process.env.REACT_APP_OPENTOK_API_SECRET;
const maxDuration = 40;

interface VideoRecordPropsType {
  LoadingComponent?: any;
  saveArchiveAction: any;
  openUploadVideo?: boolean;
  isRecordVideoScreen?: boolean;
  controls?: boolean;
  width?: number;
  height?: number;
  fluid?: boolean;
  plugins: {
    record: {
      image: boolean;
      audio: boolean;
      video: boolean;
      maxLength: number;
      debug: boolean;
      videoMimeType: string;
    };
  };
  startRecordVideo: any;
  confirmArchiveAction?: any;
  authorizationHeaders: any;
}

const networkError = 'Error: Can not connect to recording server.';

export class VideoRecord extends Component<VideoRecordPropsType> {
  player: any;
  videoNode: any;
  state = {
    session: null,
    error: null,
    connection: 'Connecting',
    publishVideo: false,
    sessionId: '',
    token: '',
    archiveId: '',
    onRecord: false,
    duration: 0,
    archive: null,
    confirmStore: false
  };
  sessionEventHandlers: any;
  publisherEventHandlers: any;
  subscriberEventHandlers: any;
  downloadTimer: any;

  constructor(props: any) {
    super(props);

    this.sessionEventHandlers = {
      sessionConnected: () => {
        console.log('connect');
        this.setState({ connection: 'Connected' });
      },
      sessionDisconnected: () => {
        console.log('disconnect');
        this.setState({ connection: 'Disconnected' });
      },
      sessionReconnected: () => {
        console.log('reconnect');
        this.setState({ connection: 'Reconnected' });
      },
      sessionReconnecting: () => {
        console.log('reconnecting');
        this.setState({ connection: 'Reconnecting' });
      }
    };

    this.publisherEventHandlers = {
      accessDenied: () => {
        console.log('User denied access to media source');
      },
      streamCreated: () => {
        console.log('Publisher stream created');
      },
      streamDestroyed: (reason: any) => {
        console.log(`Publisher stream destroyed because: ${reason}`);
      }
    };

    this.subscriberEventHandlers = {
      videoEnabled: () => {
        console.log('Subscriber video enabled');
      },
      videoDisabled: () => {
        console.log('Subscriber video disabled');
      }
    };
  }

  onSessionError = (error: any) => {
    this.createSessionOpenTok();
    this.setState({ error: networkError, publishVideo: false });
  };

  onPublish = () => {
    console.log('Publish Success');
  };

  onPublishError = (error: any) => {
    this.createSessionOpenTok();
    this.setState({ error: networkError, publishVideo: false });
  };

  onSubscribe = () => {
    console.log('Subscribe Success');
  };

  onSubscribeError = (error: any) => {
    this.createSessionOpenTok();
    this.setState({ error: networkError, publishVideo: false });
  };

  toggleVideo = () => {
    this.setState({ error: '', publishVideo: !this.state.publishVideo });
  };

  componentWillMount() {
    this.createSessionOpenTok();
  }

  componentDidMount() {
    const { archiveId, archive } = this.state;
    const { startRecordVideo } = this.props;
  }

  confirmStoreVideo = (callback: any) => {
    const { confirmArchiveAction } = this.props;
    const { archiveId, sessionId } = this.state;
    const data = {
      archive_id: archiveId,
      confirm: 'yes',
      session_id: sessionId
    };
    this.setState({ confirmStore: true });
    confirmArchiveAction(data);
    callback();
  };

  closeVideoRecordConfirm = (callback: any) => {
    const { confirmArchiveAction } = this.props;
    const { archiveId, sessionId } = this.state;
    const data = {
      archive_id: archiveId,
      confirm: 'no',
      session_id: sessionId
    };
    this.setState({ duration: 0, confirmStore: true });
    confirmArchiveAction(data);
    //this.deleteArchive();
    callback();
  };

  closeRecordWindow = () => {
    const { archiveId, sessionId } = this.state;
    const { startRecordVideo, confirmArchiveAction } = this.props;
    if (archiveId) {
      const { authorizationHeaders } = this.props;
      const headers = { ...authorizationHeaders };
      const path = ApiPaths.OPENTOK_STOP_ARCHIVE;
      const data = {
        apiKey: apiKey,
        apiSecret: apiSecret
      };
      axios
        .post(
          getApiPath(path),
          { archive_id: archiveId },
          {
            headers: headers
          }
        )
        .then((res: any) => {
          startRecordVideo(false);
          this.setState({ onRecord: false });

          const data = {
            archive_id: archiveId,
            confirm: 'no',
            session_id: sessionId
          };
          this.setState({ confirmStore: true });
          confirmArchiveAction(data);
        })
        .catch(err => {
          console.log('Create session error');
        });
    }
  };

  // destroy player on unmount
  componentWillUnmount() {
    setTimeout(() => {
      if (this.state.onRecord) {
        this.closeRecordWindow();
      }
    }, 3000);
  }

  confirmSubmit = () => {
    let _self = this;
    try {
      confirmAlert({
        customUI: (data: any) => {
          const { onClose } = data;
          return (
            <div className="custom-ui-confirm">
              <a className="custom-close-confirm" onClick={onClose}>
                <img src="/images/icons/close-modal.png" />
              </a>
              <p className="confirm-message">Do you want to upload this video?</p>
              <div className="confirm-button">
                <a onClick={_self.confirmStoreVideo.bind(_self, onClose)} className="confirm-ok-button">
                  Yes
                </a>
                <a onClick={_self.closeVideoRecordConfirm.bind(_self, onClose)} className="confirm-cancel-button">
                  No
                </a>
              </div>
            </div>
          );
        },
        willUnmount: () => {
          setTimeout(() => {
            const { confirmArchiveAction } = this.props;
            const { archiveId, sessionId, confirmStore } = this.state;
            if (!confirmStore) {
              const data = {
                archive_id: archiveId,
                confirm: 'no',
                session_id: sessionId
              };
              this.setState({ duration: 0 });
              confirmArchiveAction(data);
            }
          }, 2000);
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  // readAsArrayBuffer(blob: any) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsArrayBuffer(blob);
  //     reader.onloadend = () => {
  //       if (reader.result) {
  //         resolve(reader.result);
  //       }
  //     };
  //     reader.onerror = (ev: any) => {
  //       reject(ev.error);
  //     };
  //   });
  // }

  // injectMetadata(blob: any) {
  //   const decoder = new Decoder();
  //   const reader = new Reader();
  //   reader.logging = false;
  //   reader.drop_default_duration = false;
  //   // load webm blob and inject metadata
  //   this.readAsArrayBuffer(blob).then((buffer: any) => {
  //     const elms = decoder.decode(buffer);
  //     elms.forEach(elm => {
  //       reader.read(elm);
  //     });
  //     reader.stop();

  //     const refinedMetadataBuf = tools.makeMetadataSeekable(reader.metadatas, reader.duration, reader.cues);
  //     const body = buffer.slice(reader.metadataSize);
  //     const result = new Blob([refinedMetadataBuf, body], { type: blob.type });
  //     this.setState({ video: result });
  //     this.confirmSubmit();
  //   });
  // }

  createSessionOpenTok = () => {
    const { authorizationHeaders } = this.props;
    const headers = { ...authorizationHeaders };
    const path = ApiPaths.OPENTOK_SESSION;
    const data = {
      apiKey: apiKey,
      apiSecret: apiSecret
    };
    axios
      .get(getApiPath(path), {
        headers: headers
      })
      .then((res: any) => {
        const result = res.data;
        this.setState({ sessionId: result.session_id, token: result.token });
      })
      .catch(err => {
        console.log('Create session error');
      });
  };

  onStartCountdown = () => {
    const archivingText = document.querySelector('.OT_archiving-status');
    if (archivingText) {
      setTimeout(() => { archivingText.textContent = '3' }, 0);
      setTimeout(() => { archivingText.textContent = '2' }, 1000);
      setTimeout(() => { archivingText.textContent = '1' }, 2000);
      setTimeout(() => { archivingText.textContent = 'GO!' }, 3000);
    }
  };

  onStartRecord = () => {
    const { sessionId, token } = this.state;
    const { startRecordVideo } = this.props;
    const timestamp = new Date().getTime();
    const archiveConfig = {
      session_id: sessionId,
      token: token,
      name: `belooga_${timestamp}`
      // resolution: '1280x720',
      // layout: {
      //   type: 'pip'
      // }
      //resolution: '640x480'
      //outputMode: 'composed',
      //'1280x720'
    };

    const { authorizationHeaders } = this.props;
    const headers = { ...authorizationHeaders };
    const path = ApiPaths.OPENTOK_START_ARCHIVE;
    const data = {
      apiKey: apiKey,
      apiSecret: apiSecret
    };
    this.onStartCountdown()
    this.setState({ onRecord: true });
    setTimeout(() => {
    axios
      .post(getApiPath(path), archiveConfig, {
        headers: headers
      })
      .then((res: any) => {
          const result = res.data;

          const archivingTitle = document.querySelector('.OT_archiving-light-box');
          if (archivingTitle && archivingTitle.hasAttribute('title')) {
            archivingTitle.setAttribute('title', 'Recording on');
          }
          const archivingText = document.querySelector('.OT_archiving-status');
          if (archivingText) {
            archivingText.textContent = 'Recording on';
          }

          startRecordVideo(true);

          const { saveArchiveAction } = this.props;
          const data = {
            archive_id: result.archive_id,
            session_id: sessionId
          };
          saveArchiveAction(data);

          this.setState({ archiveId: result.archive_id, onRecord: true });

          let timeleft = 0;
          this.downloadTimer = setInterval(() => {
            this.setState({ duration: ++timeleft });
            if (timeleft >= maxDuration) {
              clearInterval(this.downloadTimer);
              this.onFinishRecord();
            }
          }, 1000);
        })
        .catch(err => {
          console.log('Create session error');
        });
      }, 3000);
  };

  onFinishRecord = () => {
    const { archiveId } = this.state;
    const { startRecordVideo } = this.props;

    const { authorizationHeaders } = this.props;
    const headers = { ...authorizationHeaders };
    const path = ApiPaths.OPENTOK_STOP_ARCHIVE;
    const data = {
      apiKey: apiKey,
      apiSecret: apiSecret
    };
    axios
      .post(
        getApiPath(path),
        { archive_id: archiveId },
        {
          headers: headers
        }
      )
      .then((res: any) => {
        clearInterval(this.downloadTimer);

        startRecordVideo(false);
        this.setState({ onRecord: false });

        const archivingTitle = document.querySelector('.OT_archiving-light-box');
        if (archivingTitle && archivingTitle.hasAttribute('title')) {
          archivingTitle.setAttribute('title', 'Recording off');
        }
        const archivingText = document.querySelector('.OT_archiving-status');
        if (archivingText) {
          archivingText.textContent = 'Recording off';
        }

        this.confirmSubmit();
      })
      .catch(err => {
        console.log('Stop archive error');
      });
  };

  deleteArchive = () => {
    const { archiveId } = this.state;
    const { startRecordVideo } = this.props;
    // opentok.deleteArchive(archiveId, (err: string) => {
    //   if (err) {
    //     return console.log(err);
    //   }
    //   startRecordVideo(false);
    //   this.setState({ onRecord: false });
    //   console.log('Delete archive:');
    // });
  };

  grid = () => {
    return (
      <div className="grid-container">
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
      </div>
    )
  }

  getArchive = () => {
    const { archiveId } = this.state;

    const { authorizationHeaders } = this.props;
    const headers = { ...authorizationHeaders };
    const path = ApiPaths.OPENTOK_GET_ARCHIVE;
    const data = {
      apiKey: apiKey,
      apiSecret: apiSecret
    };
    axios
      .get(getApiPath(path), { params: { archive_id: archiveId }, headers: headers })
      .then((res: any) => {
        const result = res.data;
        this.setState({ archive: result });
      })
      .catch(err => {
        console.log('Get archive error');
      });
  };

  render() {
    const { error, sessionId, token, publishVideo, onRecord, duration } = this.state;
    const { LoadingComponent } = this.props;
    return sessionId && token ? (
      <Fragment>
        {error ? (
          <div className="error-section">
            <Alert type="alert" message={error} />
            <p>Please click button bellow to reconnect.</p>
          </div>
        ) : null}
        <div className="record-section video-js vjs-record">
          {this.grid()}
          {publishVideo ? (
            <OTSession
              apiKey={apiKey}
              sessionId={sessionId}
              token={token}
              onError={this.onSessionError}
              eventHandlers={this.sessionEventHandlers}
            >
              <div className="record-button-block vjs-control-bar">
                <button
                  className="btn-record vjs-record-button vjs-control vjs-button vjs-icon-record-start"
                  title="Record"
                  disabled={onRecord}
                  onClick={this.onStartRecord}
                />
                <button
                  className="btn-record vjs-record-button vjs-control vjs-button vjs-icon-record-stop"
                  disabled={!onRecord}
                  onClick={this.onFinishRecord}
                />
                <div className="vjs-current-time vjs-time-control vjs-control">
                  <span className="vjs-current-time-display" aria-live="off" role="presentation">
                    0:{duration < 10 ? '0' + duration : duration}
                  </span>
                </div>

                <div className="vjs-time-control vjs-time-divider" aria-hidden="true">
                  <div>
                    <span>/</span>
                  </div>
                </div>

                <div className="vjs-duration vjs-time-control vjs-control">
                  <span className="vjs-duration-display" aria-live="off" role="presentation">
                    0:{maxDuration}
                  </span>
                </div>
              </div>

              <OTPublisher
                properties={{ publishVideo, width: '100%', height: '100%', facingMode: 'user' }}
                onPublish={this.onPublish}
                onError={this.onPublishError}
                eventHandlers={this.publisherEventHandlers}
              />
              <OTStreams>
                <OTSubscriber />
              </OTStreams>
            </OTSession>
          ) : (
              <div className={`toggle-video ${publishVideo}`}>
                <button
                  className="toggle-video-button vjs-record vjs-device-button vjs-control vjs-icon-video-perm"
                  onClick={this.toggleVideo}
                />
              </div>
            )}
        </div>
      </Fragment>
    ) : (
        <div className="record-loading-section">{LoadingComponent}</div>
      );
  }
}
