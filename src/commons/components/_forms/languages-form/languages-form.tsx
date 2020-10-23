import React, { Component } from 'react';
import { TagInputLanguage } from '../../tag-input-language/tag-input-language';
import styles from '../skill-form/skill-form.module.scss';
import { FormError } from '../../form-error/form-error';
import { any } from 'prop-types';
import { confirmAlert } from 'react-confirm-alert';

interface LanguagesFormPropTypes {
  form: any;
  isModalOpen: boolean;
  onSubmit: any;
  isLoading: boolean;
  title: string;
  submitBtnTitle: string;
  handleSubmitAction?:any;
  handleClose?:any;
}
interface LanguagesFormStateTypes {
  languages?: any;
  requireMessage?: string;
  isCancel: boolean;
}

class Languages extends Component<LanguagesFormPropTypes, LanguagesFormStateTypes> {
  constructor(props: any) {
    super(props);
    this.state = { languages: [], requireMessage: '', isCancel: false };
    // this.tagInputLanguage = React.createRef();
  }
  languages = {
    name: 'languages',
    options: [
      {
        initialValue: []
      }
    ]
  };
  tagInputLanguage: any
  
  componentWillUpdate(nextprops: any) {
    const { form } = this.props;
    const { getFieldProps } = form;
    const fieldProps = { ...getFieldProps(this.languages.name) };
    const currentLanguages = fieldProps.value;
    if (currentLanguages && currentLanguages.length && this.state.languages.length === 0) {
      this.setState({ languages: currentLanguages });
    }
  }
  
  addLanguage = (language: any = {}) => {
    //  let {languages}= this.state;
    //  languages.push(language)
    this.setState({ languages: language, requireMessage: '' });
  };
  removeLanguage = ( language:any) => {
    let { languages } = this.state;
    // languages.splice(index, 1);
    this.setState({ languages : language });
  };
  onUpdateLanguage = (data: any) => {
    const {
      form: { setFieldsValue }
    } = this.props;
    // update
    this.setState({ languages: data });
    setFieldsValue({ languages: data });
  };
  titleCase = (str: string) => {
    let splitStr = str.split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  };

  convertArrData = (data: any) => {
    for(let i = 0; i < data.length; i++){
      data[i].name = this.titleCase(data[i].name);
    }
    return data;
  };
  handleSubmit = (e: any) => {
    e.preventDefault();
    const { form, onSubmit, isLoading, handleSubmitAction} = this.props;
    const { languages } = this.state;
    if (this.state.requireMessage !== '') {
      this.setState({ requireMessage: '' });
    }
    form.validateFields((error: any, value: any) => {
      if (languages.length === 0) {
        this.setState({ requireMessage: 'Language name is required and Please choose level.' });
        return false;
      }
      const newValue = { languages: this.convertArrData(languages) };
      !isLoading && handleSubmitAction(newValue);
      this.setState({isCancel:false});
    });
  };
  handleClose = () => {
    const { handleClose } = this.props;
    // console.log(this.tagInputLanguage)
    // if(this.tagInputLanguage && this.tagInputLanguage.current){
    //   console.log(this.tagInputLanguage.current)
    //   this.tagInputLanguage.current.resetState()
    // }
    this.tagInputLanguage();
    // this.setState({isCancel: true});
    handleClose();
  };


  showRequiredMessage = () => {
    this.setState({ requireMessage: 'Language name is required and Please choose level.' });
  };

  renderErrorSection = (name: string) => {
    const { getFieldError } = this.props.form;
    const errors = getFieldError(name);
    return errors
      ? errors.map((err: any, index: any) => {
          return <FormError key={index} text={err} />;
        })
      : null;
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
            <p className="confirm-message">Level of Language:</p>
            <div>
              <p>1 - Basic</p>
            </div>
            <div>
              <p>2 - Novice</p>
            </div>
            <div>
              <p>3 - Intermediate</p>
            </div>
            <div>
              <p>4 - Advanced</p>
            </div>
            <div>
              <p>5 - Expert</p>
            </div>
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
  render() {
    const { title, form, isModalOpen } = this.props;
    const { getFieldProps } = form;
    const errorSection = this.renderErrorSection(this.languages.name);
    return (
      <React.Fragment>
        <form
          className={styles['form']}
          onSubmit={(e: any) => {
            e.preventDefault();
          }}
        >
          <div className="container">
          <div style={{ marginBottom: 10, display: 'flex', justifyContent:'space-between'}}>
            <div style={{display:'flex', marginTop: 13}}>
              <h5 className={styles['about-title']} style={{ display: 'inline-block' }}>
              LANGUAGES
              </h5>
              <span>
                <i
                  className="fa fa-question-circle"
                  onClick={this.onClickQuestion}
                  style={{ color: '#39a0e8', marginLeft: 10, fontSize: 18, cursor: 'pointer' }}
                />
              </span>
              </div>
              <div style={{display:'flex', paddingTop:5}}>
                <span className={styles['check-button']}>
                  <i className="fa fa-check-circle" onClick={this.handleSubmit}/>
                  <span className={styles['tooltiptext']}>Save</span>
                </span>
                <span className={styles['cancle-button']}>
                  <i className="fa fa-times-circle" onClick={this.handleClose} />
                  <span className={styles['tooltiptext']}>Cancel</span>
                </span>
              </div>
            </div>
            <div className="row">
              {/* skill tag-input */}
              <div className="col-12 text-left" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <TagInputLanguage
                  placeHolder="Enter language"
                  resetlang = {(lang: any) => {
                    this.tagInputLanguage = lang
                  }}
                  // ref={ref=>(this.tagInputLanguage=ref)}
                  // {...getFieldProps(this.languages.name, this.languages.options)}
                  addLanguage={this.addLanguage}
                  showRequiredMessage={this.showRequiredMessage}
                  removeLanguage={this.removeLanguage}
                  onUpdateLanguage={this.onUpdateLanguage}
                  isCancel= {this.state.isCancel}
                  isModalOpen={isModalOpen}
                  {...getFieldProps(this.languages.name)}
                />
                {this.state.requireMessage ? (
                  <div className="error-group-modal">
                    <FormError text={this.state.requireMessage} />
                  </div>
                ) : null}

                {errorSection ? (
                  <div className="error-group-modal">{this.renderErrorSection(this.languages.name)}</div>
                ) : null}
              </div>
            </div>
            {/* <div className={`col-12 col-md-12 d-flex justify-content-center ${styles['save-button']}`}>
              <a className="btn-save-form" href="#" onClick={this.handleSubmit}>
                Save
              </a>
            </div> */}
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default Languages;
