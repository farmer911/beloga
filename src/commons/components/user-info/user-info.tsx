import React, { Component } from 'react';
import { AvatarUploader } from '../avatar-uploader/avatar-uploader';
import { Modal } from '../modal/modal';
import styles from './user-info.module.scss';
import { ImageWithButton, ToggleButton } from '../_buttons';
import { EditInline } from '../edit-inline/edit-inline';
import { Confirm } from '../confirm/confirm';

interface UserInfoPropTypes {
  userInfo: any;
  handleUploadAvatar: any;
  handleChangeUserInfo: any;
  handleUpdateJobTitle: any;
  handleUpdateStatusOpportunity: any;
  canEdit: boolean;
}

interface UserInfoStateTypes {
  preview: string;
  src: string;
  isModalOpen: boolean;
  isOpenConfirmSeekingModal: boolean;
}

export class UserInfo extends Component<UserInfoPropTypes, UserInfoStateTypes> {
  state = {
    preview: '',
    src: '',
    isModalOpen: false,
    isOpenConfirmSeekingModal: false
  };

  onClose = () => {
    this.setState({ preview: '' });
  };

  onCrop = (preview: string) => {
    this.setState({ preview });
  };

  toggleModal = () => {
    const { isModalOpen } = this.state;
    this.setState({ isModalOpen: !isModalOpen });
  };

  onSubmitAvatar = () => {
    const { handleUploadAvatar } = this.props;
    handleUploadAvatar(this.state.preview);
    this.toggleModal();
  };

  toggleOpportunity = (e: any) => {
    const value = (e.target as HTMLInputElement).checked;
    const { handleUpdateStatusOpportunity, userInfo } = this.props;
    if (value && userInfo && (userInfo.video_url === '' || userInfo.video_url === null)) {
      this.setState({ isOpenConfirmSeekingModal: !this.state.isOpenConfirmSeekingModal });
    } else {
      handleUpdateStatusOpportunity({ status_opportunity: value });
    }
  };

  updateJobTitle = (value: any) => {
    const { handleUpdateJobTitle } = this.props;
    handleUpdateJobTitle({ job_title: value });
  };

  toggleConfirmSeekingModal = () => {
    this.setState({
      isOpenConfirmSeekingModal: !this.state.isOpenConfirmSeekingModal
    });
  };

  render() {
    if (!this.props.userInfo) {
      return null;
    }

    const {
      canEdit = true,
      userInfo: { first_name, last_name, job_title, image_url, status_opportunity, city_name, country_name, state_name, address }
    } = this.props;
    const { src, isModalOpen, isOpenConfirmSeekingModal } = this.state;
    const _address = [];
    if (city_name) {
      _address.push(city_name);
    }
    if (state_name) {
      _address.push(state_name);
    }
    if (country_name) {
      _address.push(country_name);
    }
    const placeWork = address? address: _address.join(', ');
    return (
      <React.Fragment>
        <Modal
          isOpen={isOpenConfirmSeekingModal}
          toggleModal={() => {
            this.toggleConfirmSeekingModal();
          }}
          className={styles['confirm-seeking-modal']}
        >
          <Confirm
            message="Please upload your video resume before making your profile public."
            actionOk={() => {
              this.toggleConfirmSeekingModal();
            }}
            hasCancel={false}
          />
        </Modal>
        <div className="information-content">
          {!canEdit ? <div className='infomation-space'></div>:null}
          <div className="block-avatar">
            <ImageWithButton
              imgWidth={170}
              imgHeight={170}
              shape="round"
              btnText="edit"
              handleBtnClick={this.toggleModal}
              src={image_url && image_url !== 100 ? image_url : this.state.preview}
              canEdit={canEdit}
            />
            <Modal isOpen={isModalOpen} toggleModal={this.toggleModal} className="avatar-uploader-modal">
              <AvatarUploader
                src={src}
                preview={this.state.preview}
                onClose={this.onClose}
                onCrop={this.onCrop}
                onSubmit={this.onSubmitAvatar}
              />
            </Modal>
          </div>
          <div className="block-title-location">
            <h4 className="line-name">{`${first_name} ${last_name}`}</h4>
            <label className="line-title">{job_title}</label>
            {/* <EditInline value={job_title} handleChangeValue={this.updateJobTitle} canEdit={canEdit} /> */}
            {placeWork && placeWork.trim() ? <p className="line-location">{placeWork}</p> : null}
          </div>
        </div>
        {canEdit ? (
          <div className="block-seeking">
            <div className={`text-lg-center text-md-center text-sm-center col-12 col-md-12 ${styles['status-user']}`}>
              <ToggleButton handleToggle={this.toggleOpportunity} isChecked={status_opportunity} />
              {status_opportunity ? (
                <p className={styles['seeking-label']}>Public</p>
              ) : (
                <p className={styles['seeking-label']}>Private</p>
              )}
            </div>
          </div>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}
