import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import {
  ExperienceListItem,
  EducationListItem,
  JobOpeningItem,
  VideoListItem,
  CertificationListItem,
  SkillListItem,
  LanguageListItem,
  InterestListItem,
  Modal,
  Confirm
} from '../commons/components';
import {
  getJobOpeningListAction,
  getVideoListAction,
  selectJobOpeningsList,
  selectVideoList
} from '../ducks/home.duck';
import { apiToForm, formToApi } from '../utils/data-mapper-factory';
import {
  getExperienceDataAction,
  addExperienceDataAction,
  updateExperienceDataAction,
  deleteExperienceDataAction,
  selectExperienceData,
  selectIsGettingExperience,
  arrangeExpAction
} from '../ducks/user-experience.duck';
import {
  getEducationDataAction,
  addEducationDataAction,
  updateEducationDataAction,
  deleteEducationDataAction,
  selectEducationData,
  selectIsGettingEducation,
  arrangeEducation
} from '../ducks/user-education.duck';
import {
  getCertificateDataAction,
  addCertificateDataAction,
  updateCertificateDataAction,
  deleteCertificateDataAction,
  selectCertificateData,
  selectIsGettingCertificate,
  arrangeAwardAction
} from '../ducks/user-certification.duck';
import {
  selectSkillData,
  selectLanguageData,
  selectInterestData,
  updateUserInfoAction,
  updateUserSkillAction,
  updateUserLanguageAction,
  updateUserInterestAction,
  selectUserInfo,
  updateLocalUserInfo
} from '../ducks/user.duck';

const EducationForm = React.lazy(() => import('../commons/components/_forms/education-form/education-form'));
const ExperienceForm = React.lazy(() => import('../commons/components/_forms/experience-form/experience-form'));
const CertificateForm = React.lazy(() => import('../commons/components/_forms/certificate-form/certificate-form'));
const SkillForm = React.lazy(() => import('../commons/components/_forms/skill-form/skill-form'));
const LanguageForm = React.lazy(() => import('../commons/components/_forms/languages-form/languages-form'));
const InterestForm = React.lazy(() => import('../commons/components/_forms/interest-form/interest-form'));
const ListForm = React.lazy(() => import('../commons/components/_forms/list-form/list-form'));
const EnhanceExpericeForm = createForm()(ExperienceForm);
const EnhanceEducationForm = createForm()(EducationForm);
const EnhanceCertificateForm = createForm()(CertificateForm);
const EnhanceSkillForm = createForm()(SkillForm);
const EnhanceLanguageForm = createForm()(LanguageForm);
const EnhanceInterestForm = createForm()(InterestForm);

const enhanceGenericList = (GenericListComponent: any, ListItemComponent: any) => {
  const Wrapper = () => {
    return class extends Component<any> {
      state = {
        isModalOpen: false,
        isEditListModalOpen: false,
        modalTitle: '',
        submitBtnTitle: '',
        handleFormSubmit: () => {},
        isOpenConfirmModal: false,
        deleteId: ''
      };
      formRef: any;
      form = setForm(ListItemComponent);

      toggleModal = (callback: any = null) => {
        if (this.form === undefined) {
          return;
        }
        //Reset State
        if (this.formRef && typeof this.formRef.setInitialState !== 'undefined') {
          this.formRef.setInitialState();
        }
        const { isModalOpen } = this.state;
        this.setState({
          isModalOpen: !isModalOpen
        });
        try {
          callback();
        } catch (e) {
          //console.log(e.message);
        }
      };

      toggleEditListModal = () => {
        if (this.form === undefined) {
          return;
        }
        const { isEditListModalOpen } = this.state;
        this.setState({
          isEditListModalOpen: !isEditListModalOpen
        });
      };

      toggleAddModal = () => {
        if (this.form === undefined) {
          return;
        }
        const { form } = this.formRef.props;
        const { addDataFunc, data } = this.props;
        const { title, isAddWithEdit, mode } = this.form;
        if (isAddWithEdit) {
          form.setFieldsValue({
            ...apiToForm(ListItemComponent)(data)
          });
        }
        this.setState({
          modalTitle: `Add new ${title}`.toUpperCase(),
          submitBtnTitle: 'Add',
          handleFormSubmit: (data: any, logoFile: any) => {
            const mappedData = formToApi(ListItemComponent)(data);
            addDataFunc(mappedData, logoFile);
            this.toggleModal();
            if (mode === 'readonly') {
              this.toggleEditListModal();
            }
          }
        });
        isAddWithEdit ? () => {} : form.resetFields();
        this.toggleModal();
        if (mode === 'readonly') {
          this.toggleEditListModal();
        }
      };

      toggleConfirmDeleteModal = () => {
        const { deleteDataFunc } = this.props;
        this.setState({
          isOpenConfirmModal: !this.state.isOpenConfirmModal
        });
      };

      toggleEditModal = (id: string, data: any) => {
        if (this.form === undefined) {
          return;
        }
        const { updateDataFunc } = this.props;
        const { form } = this.formRef.props;
        const { title, mode } = this.form;
        form.setFieldsValue({
          ...apiToForm(ListItemComponent)(data)
        });
        this.setState({
          modalTitle: `Edit ${title}`,
          submitBtnTitle: 'Save changes',
          handleFormSubmit: (data: any, logoFile: any) => {
            const mappedData = formToApi(ListItemComponent)(data);
            updateDataFunc(id, mappedData, logoFile);
            this.toggleModal();
            if (mode === 'readonly') {
              this.toggleEditListModal();
            }
          }
        });

        this.toggleModal();
        if (mode === 'readonly') {
          this.toggleEditListModal();
        }
      };

      deleteConfirm = (id: string) => {
        if (this.form === undefined) {
          return;
        }
        const { mode } = this.form;
        this.setState({
          deleteId: id
        });

        if (mode === 'readonly') {
          this.toggleEditListModal();
        }
        this.toggleConfirmDeleteModal();
      };

      componentDidMount() {
        const { fetchDataFunc } = this.props;
        fetchDataFunc && fetchDataFunc();
      }

      // handleArrangeEducation = (data: any) => {console.log("handle in ")
      //   const {arrangeEducation} = this.props;
      //   arrangeEducation(data);
      // }

      render() {
        const {
          isModalOpen,
          modalTitle,
          handleFormSubmit,
          submitBtnTitle,
          isEditListModalOpen,
          isOpenConfirmModal
        } = this.state;
        const { listItemProps, isLoading, deleteDataFunc, arrangeEducation } = this.props;
        const Form = (this.form && this.form.formComp) || null;
        const mode = (this.form && this.form.mode) || null;
        return (
          <React.Fragment>
            <GenericListComponent
              mode={mode}
              onIconClick={this.toggleAddModal}
              onIconClick2={this.toggleEditListModal}
              ListItemComponent={ListItemComponent}
              listItemProps={{
                ...listItemProps,
                mode: mode,
                onEdit: this.toggleEditModal,
                onDelete: this.deleteConfirm
              }}
              isLoading={isLoading}
              {...this.props}
            />
            <Modal
              isOpen={isModalOpen}
              toggleModal={() => {
                this.toggleModal();
                if (mode === 'readonly') {
                  this.toggleEditListModal();
                }
              }}
              size="big"
            >
              {Form ? (
                <Form
                  title={modalTitle}
                  submitBtnTitle={submitBtnTitle}
                  isModalOpen={isModalOpen}
                  onSubmit={handleFormSubmit}
                  wrappedComponentRef={(inst: any) => (this.formRef = inst)}
                />
              ) : null}
            </Modal>
            <Modal
              isOpen={isOpenConfirmModal}
              toggleModal={() => {
                this.toggleConfirmDeleteModal();
                if (mode === 'readonly') {
                  this.toggleEditListModal();
                }
              }}
            >
              <Confirm
                message="Are you sure you want to delete this item?"
                actionOk={() => {
                  deleteDataFunc(this.state.deleteId);
                  this.toggleConfirmDeleteModal();
                  if (mode === 'readonly') {
                    this.toggleEditListModal();
                  }
                }}
                actionCancel={() => {
                  this.toggleConfirmDeleteModal();
                  if (mode === 'readonly') {
                    this.toggleEditListModal();
                  }
                }}
              />
            </Modal>
            <Modal
              isOpen={isEditListModalOpen}
              toggleModal={() => {
                this.toggleEditListModal();
                if (mode === 'readonly') {
                  this.toggleEditListModal();
                }
              }}
              size="big"
            >
              <ListForm
                ListComponent={() => {
                  return (
                    <GenericListComponent
                      mode="editable"
                      isEditListModalOpen={isEditListModalOpen}
                      iconClass="fas fa-plus"
                      componentModal="component-modal"
                      onIconClick={this.toggleAddModal}
                      onIconClick2={this.toggleEditListModal}
                      ListItemComponent={ListItemComponent}
                      toggleModal={this.toggleEditListModal}
                      listItemProps={{
                        ...listItemProps,
                        onEdit: this.toggleEditModal,
                        onDelete: this.deleteConfirm
                      }}
                      isLoading={isLoading}
                      // handleArrang={this.handleArrangeEducation}
                      {...this.props}
                    />
                  );
                }}
              />
            </Modal>
            
          </React.Fragment>
        );
      }
    };
  };

  enum FUNCTION_TYPE {
    GET = 'getAction',
    ADD = 'addAction',
    UPDATE = 'updateAction',
    DELETE = 'deleteAction',
    DATA_SELECTOR = 'data-selector',
    LOADING_SELECTOR = 'isLoading-selector',
    UPLOAD_LOGO = 'upload-logo',
    ARRANGE= 'arrange',
    UPDATE_LOCAL='update_local'
  }

  const setForm = (ListItemComponent: any) => {
    switch (ListItemComponent) {
      case EducationListItem: {
        return { formComp: EnhanceEducationForm, title: 'education', isAddWithEdit: false, mode: 'readonly' };
      }
      case ExperienceListItem: {
        return { formComp: EnhanceExpericeForm, title: 'experience', isAddWithEdit: false, mode: 'readonly' };
      }
      case CertificationListItem: {
        return { formComp: EnhanceCertificateForm, title: 'certificate', isAddWithEdit: false, mode: 'readonly' };
      }
      case SkillListItem: {
        return { formComp: EnhanceSkillForm, title: 'skills', isAddWithEdit: true, mode: 'editable' };
      }
      case LanguageListItem: {
        return { formComp: EnhanceLanguageForm, title: 'languages', isAddWithEdit: true, mode: 'editable' };
      }
      case InterestListItem: {
        return { formComp: EnhanceInterestForm, title: 'interests', isAddWithEdit: true, mode: 'editable' };
      }
      default:
        return undefined;
    }
  };

  const setFunction = (ListItemComponent: any, type: FUNCTION_TYPE) => {
    switch (ListItemComponent) {
      case ExperienceListItem: {
        switch (type) {
          case FUNCTION_TYPE.GET:
            return getExperienceDataAction;
          case FUNCTION_TYPE.ADD:
            return addExperienceDataAction;
          case FUNCTION_TYPE.UPDATE:
            return updateExperienceDataAction;
          case FUNCTION_TYPE.DELETE:
            return deleteExperienceDataAction;
          case FUNCTION_TYPE.DATA_SELECTOR:
            return selectExperienceData;
          case FUNCTION_TYPE.LOADING_SELECTOR:
            return selectIsGettingExperience;
            case FUNCTION_TYPE.ARRANGE:
            return arrangeExpAction;
          default:
            return undefined;
        }
      }
      case EducationListItem: {
        switch (type) {
          case FUNCTION_TYPE.GET:
            return getEducationDataAction;
          case FUNCTION_TYPE.ADD:
            return addEducationDataAction;
          case FUNCTION_TYPE.UPDATE:
            return updateEducationDataAction;
          case FUNCTION_TYPE.DELETE:
            return deleteEducationDataAction;
          case FUNCTION_TYPE.DATA_SELECTOR:
            return selectEducationData;
          case FUNCTION_TYPE.LOADING_SELECTOR:
            return selectIsGettingEducation;
            case FUNCTION_TYPE.ARRANGE:
            return arrangeEducation;
          default:
            return undefined;
        }
      }
      case JobOpeningItem: {
        switch (type) {
          case FUNCTION_TYPE.GET:
            return getJobOpeningListAction;
          case FUNCTION_TYPE.DATA_SELECTOR:
            return selectJobOpeningsList;
          default:
            return undefined;
        }
      }
      case VideoListItem: {
        switch (type) {
          case FUNCTION_TYPE.GET:
            return getVideoListAction;
          case FUNCTION_TYPE.DATA_SELECTOR:
            return selectVideoList;
          default:
            return undefined;
        }
      }
      case CertificationListItem: {
        switch (type) {
          case FUNCTION_TYPE.GET:
            return getCertificateDataAction;
          case FUNCTION_TYPE.ADD:
            return addCertificateDataAction;
          case FUNCTION_TYPE.UPDATE:
            return updateCertificateDataAction;
          case FUNCTION_TYPE.DELETE:
            return deleteCertificateDataAction;
          case FUNCTION_TYPE.DATA_SELECTOR:
            return selectCertificateData;
          case FUNCTION_TYPE.LOADING_SELECTOR:
            return selectIsGettingCertificate;
            case FUNCTION_TYPE.ARRANGE:
            return arrangeAwardAction;
          default:
            return undefined;
        }
      }
      case SkillListItem: {
        switch (type) {
          case FUNCTION_TYPE.ADD:
            return updateUserSkillAction;
          case FUNCTION_TYPE.DATA_SELECTOR:
            return selectSkillData;
          default:
            return undefined;
        }
      }
      case LanguageListItem: {
        switch (type) {
          case FUNCTION_TYPE.UPDATE_LOCAL:
            return updateLocalUserInfo;
          case FUNCTION_TYPE.ADD:
            return updateUserLanguageAction;
          case FUNCTION_TYPE.DATA_SELECTOR:
            return selectLanguageData;
          default:
            return undefined;
        }
      }
      case InterestListItem: {
        switch (type) {
          case FUNCTION_TYPE.ADD:
            return updateUserInterestAction;
          case FUNCTION_TYPE.DATA_SELECTOR:
            return selectInterestData;
          default:
            return undefined;
        }
      }
      default:
        return undefined;
    }
  };

  const mapStateToProps = (state: any) => {
    const dataSelector: any = setFunction(ListItemComponent, FUNCTION_TYPE.DATA_SELECTOR);
    const isLoadingSelector: any = setFunction(ListItemComponent, FUNCTION_TYPE.LOADING_SELECTOR);
    return {
      data: dataSelector && dataSelector(state),
      isLoading: isLoadingSelector && isLoadingSelector(state),
      userInfo: selectUserInfo(state)
    };
  };

  return connect(
    mapStateToProps,
    {
      fetchDataFunc: setFunction(ListItemComponent, FUNCTION_TYPE.GET),
      addDataFunc: setFunction(ListItemComponent, FUNCTION_TYPE.ADD),
      updateDataFunc: setFunction(ListItemComponent, FUNCTION_TYPE.UPDATE),
      deleteDataFunc: setFunction(ListItemComponent, FUNCTION_TYPE.DELETE),
      arrangeDataFunc: setFunction(ListItemComponent, FUNCTION_TYPE.ARRANGE),
      updateLocalUserInfo: setFunction(ListItemComponent, FUNCTION_TYPE.UPDATE_LOCAL)
    }
  )(Wrapper());
};

export default enhanceGenericList;
