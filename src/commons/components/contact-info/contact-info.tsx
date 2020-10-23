import React, { Component, Fragment } from 'react';
import styles from './contact-info.module.scss';
import { Link } from 'react-router-dom';
import { RoutePaths } from '../../constants';
import { ToggleButton } from '../_buttons';
import { userInfo } from 'os';
import { NavLink } from 'react-router-dom';

interface ContactInfoPropTypes {
  userInfo: any;
  canEdit?: boolean;
  handleEditClick?: any;
  handleUpdateHiddenField?: any;
}

export class ContactInfo extends Component<ContactInfoPropTypes, any> {
  state = { hide_email: undefined, hide_phone: undefined, arrayPush: [] };
  arrayPush: any = [];
  toggleEmail = (e: any) => {
    const value = (e.target as HTMLInputElement).checked;
    this.setState({ hide_email: !this.state.hide_email });
    const { handleUpdateHiddenField } = this.props;
    handleUpdateHiddenField([{ hidden_field: 'email', hidden_value: !value }, { hidden_field: 'phone', hidden_value: this.state.hide_phone }]);
  };
  togglePhone = (e: any) => {
    const value = (e.target as HTMLInputElement).checked;
    this.setState({ hide_phone: !this.state.hide_phone });
    const { handleUpdateHiddenField } = this.props;
    handleUpdateHiddenField([{ hidden_field: 'phone', hidden_value: !value }, { hidden_field: 'email', hidden_value: this.state.hide_email }]);
  };

  componentDidMount() {
    const { userInfo } = this.props;
    const { hide_email, hide_phone } = this.state;
    if (userInfo && hide_email === undefined && hide_phone === undefined) {
      this.setState({ hide_email: userInfo.hide_email, hide_phone: userInfo.hide_phone });
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const { userInfo } = nextProps;
    const { hide_email, hide_phone } = this.state;
    if (userInfo && hide_email === undefined && hide_phone === undefined) {
      this.setState({ hide_email: userInfo.hide_email, hide_phone: userInfo.hide_phone });
    }
  }

  render() {
    const { hide_phone, hide_email } = this.state;
    const { userInfo, handleEditClick, canEdit = true } = this.props;
    if (!userInfo) {
      return null;
    }

    return (
      <div className={`no-margin-bottom col-12 contact-info-section`}>
        <div className={styles['contact-info-label-container']}>
          <h3 className={`contact-info-title ${styles['title-weight']}`}>Contact Info</h3>
            {canEdit ? <a onClick={handleEditClick} className="icon-edit" /> : ''}
        </div>
        <div className={`text-block`}>
          <h5 className={`contact-title-block`}>Profile Url</h5>
          <Link className={styles['link-color']} to={RoutePaths.USER_PUBLIC.getPath(userInfo.username)}>
            {`https://belooga.com/public/${userInfo.username}`}
          </Link>
        </div>
        {(userInfo.linkedin == '' && userInfo.facebook == '' && userInfo.twitter == '' && userInfo.instagram == '' && userInfo.portfolio == '') ? null :
          <div>
            <hr className={styles['hr-color']} />
            <div className="text-block">
              <h5 className={`contact-title-block`}>Linked Sites</h5>
              <div className={`list-inline ${styles['link-wrapper']}`}>
                {userInfo.linkedin ? (
                  <a className={styles['social-link']} href={userInfo.linkedin} target="_blank">
                    <i className={` socicon-linkedin ${styles['icon-style']}`} />
                  </a>
                ) : null}
                {userInfo.facebook ? (
                  <a className={styles['social-link']} href={userInfo.facebook} target="_blank">
                    <i className={` socicon-facebook ${styles['icon-style']} `} />
                  </a>
                ) : null}
                {userInfo.twitter ? (
                  <a className={styles['social-link']} href={userInfo.twitter} target="_blank">
                    {' '}
                    <i className={` socicon-twitter ${styles['icon-style']} `} />
                  </a>
                ) : null}
                {userInfo.instagram ? (
                  <a className={styles['social-link']} href={userInfo.instagram} target="_blank">
                    <i className={` socicon-instagram ${styles['icon-style']}`} />
                  </a>
                ) : null}
                {userInfo.portfolio ? (
                  <a className={styles['social-link']} href={userInfo.portfolio} target="_blank">
                    <i className={` socicon-internet ${styles['icon-style']} `} />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        }
        {!canEdit && userInfo.hide_email && userInfo.hide_phone ? null : (
          <Fragment>
            <hr className={styles['hr-color']} />
            <div className="text-block">
              <h5 className={`contact-title-block`}>Phone & Email</h5>
              {userInfo.phone ? (
                canEdit ? (
                  <p className="contact-email-toggle">
                    <span className="item-name">
                      <a href={`tel:${userInfo.phone}`}>{userInfo.phone}</a>
                    </span>
                    <span className={`toggle-status status-phone`}>
                      <ToggleButton handleToggle={this.togglePhone} isChecked={!hide_phone} />
                      {!hide_phone ? (
                        <label className={styles['seeking-label']}>Show</label>
                      ) : (
                          <label className={styles['seeking-label']}>Hide</label>
                        )}
                    </span>
                  </p>
                ) : !userInfo.hide_phone ? (
                  <p className="contact-email-toggle">
                    <span className="item-name">
                      <a href={`tel:${userInfo.phone}`}>{userInfo.phone}</a>
                    </span>
                  </p>
                ) : null
              ) : null}

              {canEdit ? (
                <p className="contact-email-toggle">
                  <span className="item-name">
                    <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
                  </span>
                  <span className={`toggle-status status-email`}>
                    <ToggleButton handleToggle={this.toggleEmail} isChecked={!hide_email} />
                    {!hide_email ? (
                      <label className={styles['seeking-label']}>Show</label>
                    ) : (
                        <label className={styles['seeking-label']}>Hide</label>
                      )}
                  </span>
                </p>
              ) : !userInfo.hide_email ? (
                <p className="contact-email-toggle">
                  <span className="item-name">
                    <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
                  </span>
                </p>
              ) : null}
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
