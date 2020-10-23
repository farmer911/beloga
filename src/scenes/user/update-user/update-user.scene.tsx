import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Steps, Step, FormError } from '../../../commons/components';
import {
  updateUserInfoAction,
  uploadAvatarRequestAction,
  selectIsRedirect,
  selectErrorFromServer,
  selectUserInfo,
  getUserInfoAction
} from '../../../ducks/user.duck';
import { createForm } from 'rc-form';
import styles from './update-user.scene.module.scss';
import { RoutePaths } from '../../../commons/constants';
import { updateUserMapper } from '../../../utils/mapper';
import { formToApi } from '../../../utils/mapper/education.mapper';

const InformationForm = React.lazy(() =>
  import('../../../commons/components/_forms/information-form/information-form')
);

const SocialConnectForm = React.lazy(() =>
  import('../../../commons/components/_forms/social-connect-form/social-connect-form')
);

interface UpdateUserComponentProps {
  history: any;
  updateUserInfoAction: any;
  isRedirect: boolean;
  uploadAvatarRequestAction: any;
  userInfo: any;
  getUserInfoAction: any;
  errorFromServer: string;
}

class UpdateUserScene extends Component<UpdateUserComponentProps> {
  constructor(props: any) {
    super(props);
  }

  state = {
    currentStep: 1,
    isInit: false,
    containerClass: 'belooga-container hide',
    isShowValid: false
  };
  totalStep = 2;
  formRefs: any = [];
  enhancedInformationForm: any = createForm()(InformationForm);
  enhancedSocialConnectForm: any = createForm()(SocialConnectForm);

  sections: any = [this.enhancedInformationForm, this.enhancedSocialConnectForm];

  componentWillMount() {
    const { getUserInfoAction } = this.props;
    getUserInfoAction();
  }

  setShowValid = (boolean: boolean) => {
    this.setState({ isShowValid: boolean });
  };

  componentWillUpdate(nextProps: any) {
    const { history, location, userInfo, isRedirect } = nextProps;
    const pathname = location.pathname;
    const validPathname = RoutePaths.USER_UPDATE_PROFILE.getPath(userInfo.username);
    if (userInfo && pathname !== validPathname) {
      history.replace(RoutePaths.NOT_FOUND);
    }
    if (isRedirect && userInfo && userInfo.submitted) {
      history.push(RoutePaths.USER_PROFILE.getPath(userInfo.username));
    }
    const { isInit } = this.state;
    if (userInfo && !isInit) {
      const mappedData = updateUserMapper.apiToForm(userInfo);
      this.formRefs.map((form: any) => {
        form.props.form.setFieldsValue({
          ...mappedData
        });
      });
      this.setState({
        isInit: true,
        containerClass: 'belooga-container'
      });
    }
  }

  renderErrorAutoComplete = (type: string) => {
    if (type == 'city') {
      return <FormError key={type} text={'City is required'} />;
    } else if (type == 'country') {
      return <FormError key={type} text={'Country is required'} />;
    } else if (type == 'state') {
      return <FormError key={type} text={'State is required'} />;
    }
  };

  submitData = () => {
    const { updateUserInfoAction } = this.props;
    let data = {};
    this.formRefs.map((form: any) => (data = { ...form.props.form.getFieldsValue(), ...data }));
    const { validateFields } = this.formRefs[1].props.form;
    validateFields((error: any, value: any) => {
      if (!error) {
        const mappedData = updateUserMapper.formToApi(data);
        updateUserInfoAction(mappedData);
      }
    });
  };

  skipStep = () => {
    const { history, userInfo } = this.props;
    const userProfile = RoutePaths.USER_PROFILE.getPath(userInfo.username);
    history.replace(userProfile);
  };

  moveStep = (step: number) => {
    const { updateUserInfoAction } = this.props;
    const { currentStep } = this.state;
    const { validateFields } = this.formRefs[currentStep - 1].props.form;

    let data: any = {};
    this.formRefs.map((form: any) => (data = { ...form.props.form.getFieldsValue(), ...data }));
    const { country_name, city_name, state_name, job_title, date_of_birth, address, phone } = data;
    if (
      // country_name == '' ||
      // city_name == '' ||
      // state_name == '' ||
      // !country_name ||
      // !city_name ||
      // !state_name ||
      address == '' ||
      !address ||
      job_title == '' ||
      date_of_birth == '' ||
      !date_of_birth || !phone
    ) {
      this.setState({ isShowValid: true });
      return;
    }
    this.setState({ isShowValid: false });

    validateFields((error: any, value: any) => {
      if (!error) {
        const mappedData = updateUserMapper.formToApi(data);
        updateUserInfoAction(mappedData, false);

        this.setState({
          currentStep: step
        });
      }
    });
  };

  renderStepButton = (text: string, step: number, handleClick: any = this.moveStep) => {
    return (
      <a className="btn btn--primary no-margin-bottom update-profile-btn" onClick={() => handleClick(step)}>
        <span className="btn__text text-uppercase">{text}</span>
      </a>
    );
  };

  renderSkipLink = (text: string, step: number, handleClick: any = this.moveStep) => {
    return (
      <div className="skip-block">
        <a className="skip-step-progress" onClick={() => handleClick(step)}>
          {text}
        </a>
      </div>
    );
  };

  renderCaseStepButtons = () => {
    const { currentStep } = this.state;
    if (currentStep === 1) {
      return this.renderStepButton('Next', currentStep + 1);
    }
    if (currentStep === this.totalStep) {
      return (
        <React.Fragment>
          {this.renderStepButton('Previous', currentStep - 1)}
          {this.renderStepButton('Finish', 0, this.submitData)}
          {this.renderSkipLink('Skip', 0, this.skipStep)}
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {this.renderStepButton('Previous', currentStep - 1)}
        {this.renderStepButton('Next', currentStep + 1)}
      </React.Fragment>
    );
  };

  renderStepContent = () => {
    const { currentStep, containerClass } = this.state;
    const { uploadAvatarRequestAction, userInfo } = this.props;
    return this.sections.map((section: any, index: any) => {
      const SectionComponent = section;
      const sectionWrapperClass = index !== currentStep - 1 ? 'display-none' : '';
      return (
        <div key={index} className={`${sectionWrapperClass} ${containerClass}`}>
          <SectionComponent
            userInfo={userInfo}
            renderErrorAutoComplete={this.renderErrorAutoComplete}
            setShowValid={this.setShowValid}
            isShowValid={this.state.isShowValid}
            handleUploadAvatar={uploadAvatarRequestAction}
            wrappedComponentRef={(inst: any) => (this.formRefs[index] = inst)}
          />
        </div>
      );
    });
  };

  render() {
    const { errorFromServer } = this.props;
    return (
      <div>
        <div className={`container ${styles['margin-top']}`}>
          <div className="row">
            <div className="col-12">
              <Steps current={this.state.currentStep}>
                <Step title="Personal Information" />
                <Step title="Connect Your Socials" />
              </Steps>
              <div className={styles['step-content']}>{this.renderStepContent()}</div>
              <div className="text-center">
                <FormError text={errorFromServer} />
              </div>
              <div className={styles['step-button']}>{this.renderCaseStepButtons()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    isRedirect: selectIsRedirect(state),
    errorFromServer: selectErrorFromServer(state),
    userInfo: selectUserInfo(state)
  };
};

export default connect(
  mapStateToProps,
  {
    updateUserInfoAction,
    uploadAvatarRequestAction,
    getUserInfoAction
  }
)(UpdateUserScene);
