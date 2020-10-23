import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectAuthState } from '../../ducks/auth.duck';
import { fetchCareersAction, selectListCareers, selectIsLoading, ApplyJob } from '../../ducks/careers.duck';
import { ContactForm } from './contact-form/contact-form';
import { createForm } from 'rc-form';
import { selectUserInfo } from '../../ducks/user.duck';
import { confirmAlert } from 'react-confirm-alert';
import { Modal, LoadingIcon } from '../../commons/components';
import { loadingWithConfig } from '../../HOCs';

const data = {
  job_id: '1a',
  job_title: 'python BE',
  location: 'los anges',
  short_description: 'abcdef',
  video: '',
  job_details: {
    company_description: 'a',
    how_to_apply: 'b',
    position_description: 'c'
  },
  responsibilities: { description: 1 },
  recommended_qualification: { description: 1 },
  benefits: [{ description: 3 }, { description: 'as' }]
};
interface CareersDetail {
  listCareers: any;
  fetchCareersAction: any;
  isLoading: boolean;
  errorFromServer: string;
  userInfo: any;
  ApplyJob: any;
}
interface CareersStateTypes {
  isApply?: boolean;
  data: any;
  isOpenModal: boolean;
  classAlert: boolean;
}
const DefaultLoadingPage = loadingWithConfig(LoadingIcon);
const enhanceContactForm = createForm('careers')(ContactForm);
class CareersDetail extends Component<CareersDetail, CareersStateTypes> {
  constructor(props: any) {
    super(props);
    this.state = {
      isApply: false,
      data: null,
      isOpenModal: false,
      classAlert: false
    };
    this.handelApply = this.handelApply.bind(this);
    this.handelApplyAble = this.handelApplyAble.bind(this);
    // this.toggleModal = this.toggleModal.bind(this);
  }
  componentWillMount() {
    document.body.classList.add('careers-scene');
    const { fetchCareersAction } = this.props;
    fetchCareersAction();
  }
  componentWillUnmount() {
    document.body.classList.remove('careers-scene');
  }
  componentWillReceiveProps(nextprops:any) {
    const { listCareers } = this.props;
    const pathname = window.location.pathname;
    let idjob = pathname.slice(9, pathname.length);
    if(listCareers != nextprops.listCareers) {
      let newList = nextprops.listCareers;
      if (newList && newList.results) {
        return newList.results.map((item: any, index: number) => {
          if (item.slug == idjob) {
            return this.setState({ data: item });
          }
        });
      }
    }
    

  }
  componentDidUpdate() {
    const { userInfo } = this.props;
    if(userInfo) {
    if (this.state.isApply == true && userInfo.status_opportunity == false) {
      this.onClickQuestion();
      this.setState({ isApply: false });
    }
  } else if(this.state.isApply == true && !userInfo) {
    this.onClickQuestion();
    this.setState({ isApply: false });
  }
}
  renderBenifit() {
    const { data } = this.state;
    if (data && data != null) {
      return data.benefits.map((item: any, index: number) => {
        return (
          <div key={index} className="carres-detail-content-text">
            {' '}
            - {item.description}
          </div>
        );
      });
    }
  }
  renderresponsibilities() {
    const { data } = this.state;
    if (data && data != null) {
      return data.responsibilities.map((item: any, index: number) => {
        return (
          <div key={index} className="carres-detail-content-text">
            {' '}
            - {item.description}
          </div>
        );
      });
    }
  }
  renderrecommen() {
    const { data } = this.state;
    if (data && data != null) {
      return data.recommended_qualification.map((item: any, index: number) => {
        return (
          <div key={index} className="carres-detail-content-text">
            {' '}
            - {item.description}
          </div>
        );
      });
    }
  }
  onClickQuestion = () => {
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>
            <p className="confirm-message">Sign in and publicize Belooga profile to continue.</p>
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
  
  handelApply() {
    this.setState({ isApply: !this.state.isApply, isOpenModal: !this.state.isOpenModal, classAlert:false });
  }
  handelApplyAble() {
    this.setState({ isApply: false });
  }
  submitContact = (data: any) => {
    const { ApplyJob } = this.props;
    const pathname = window.location.pathname;
    let idjob = pathname.slice(9, pathname.length);
    let newData = { ...data, job_id: idjob };
    ApplyJob(newData);
    this.setState({ classAlert: true });
  };
  render() {
    const EnhanceContactForm = enhanceContactForm;
    const { isLoading, errorFromServer, userInfo } = this.props;
    const { isApply, data, isOpenModal, classAlert } = this.state;
    return isLoading ? (
      <React.Fragment>{DefaultLoadingPage}</React.Fragment>
    ) : (
      data &&
      data != null && (
        <div className="container careers-page">
          <div className="careers-detail-content">
          <div className="careers-title-left-site col-md-12 col-sm-12">
            {data &&
              <div className='careers-title-center'>{data.job_title}</div>
            }
            {(data.video_compressed && data.video_compressed != '') ? 
            <div className="careers-title-left-video">
              <video className="career-video" src={data.video_compressed} controls></video>
            </div>: null}
            {(data && data.job_detail.company_description != '') ? <div>
            <div className="careers-title-left ">Company Description:</div>
            <div className="careers-content-left">{data.job_detail.company_description}</div>
            </div> : null}
            {(data && data.job_detail.position_description != '') ? <div>
            <div className="careers-title-left ">Position Description:</div>
            <div className="careers-content-left ">{data.job_detail.position_description}</div>
            </div> : null}
            </div>
            <div className="careers-title-left-site col-md-12 col-sm-12">
            {(data && data.responsibilities.length >0) ? <div>
            <div className="careers-title-left ">Employee Responsibilities:</div>
            <div className="careers-content-left ">
            {this.renderresponsibilities()}</div></div> : null}
            {(data && data.recommended_qualification.length >0) ? <div>
            <div className="careers-title-left ">Recommended Qualifications:</div>
            <div className="careers-content-left ">
            {this.renderrecommen()}</div></div> : null}
            {(data && data.benefits.length >0) ? <div>
            <div className="careers-title-left ">Benefits and Compensation:</div>
            <div className="careers-content-left ">
            {this.renderBenifit()}</div></div> : null}
            </div>
            <div className="careers-btn">
              <button className="btn btn--primary type--uppercase" onClick={this.handelApply}>
                Apply Now
              </button>
            </div>
            {isApply && (
              <div className="careers-contact-form">
                {(isApply && userInfo && userInfo.status_opportunity) ? (
                  <div className="careers-popup-contact">
                    <Modal isOpen={isOpenModal} toggleModal={this.handelApply} className="careers-modal">
                      <EnhanceContactForm
                        isLoading={isLoading}
                        actionSubmit={this.submitContact}
                        errorFromServer={errorFromServer}
                        userName={userInfo.username}
                        classAlert={classAlert}
                      />
                    </Modal>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    ...selectAuthState(state),
    listCareers: selectListCareers(state),
    isLoading: selectIsLoading(state),
    userInfo: selectUserInfo(state)
  };
};

export default connect(
  mapStateToProps,
  { fetchCareersAction, ApplyJob }
)(CareersDetail);
