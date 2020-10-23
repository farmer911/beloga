import React, { Component } from 'react';
import { TagInput } from '../../tag-input/tag-input';
import styles from './interest-form.module.scss';
import { FormError } from '../../form-error/form-error';
import { enhanceTagInput } from '../../../../HOCs';
import { confirmAlert } from 'react-confirm-alert';

const EnhancedTagInput = enhanceTagInput();

interface CertificateFormPropTypes {
  form: any;
  onSubmit: any;
  isLoading: boolean;
  title: string;
  submitBtnTitle: string;
  requireMessage?: string;
  handleSubmitAction?:any;
  handleClose?:any;
}

interface CertificateFormStateTypes {
  requireMessage?: string;
}

class InterestForm extends Component<CertificateFormPropTypes, CertificateFormStateTypes> {
  constructor(props: any) {
    super(props);
    this.state = { requireMessage: '' };
  }

  interests = {
    name: 'interests',
    options: [
      {
        initialValue: []
      }
    ]
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    const { form, onSubmit, isLoading,handleSubmitAction } = this.props;
    form.validateFields((error: any, value: any) => {
      if (!error) {
        if (!value.interests || (value.interests && value.interests.length === 0)) {
          this.setState({ requireMessage: 'Please add an interest.' });
          return false;
        }
        !isLoading && handleSubmitAction(value);
      }
    });
  };
  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
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

  componentWillUpdate(nextprops: any) {
    if (this.state.requireMessage !== '') {
      this.setState({ requireMessage: '' });
    }
  }
  onClickQuestion = () =>{
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>
            <p className="confirm-message">Choose from provided list or add any interest of your own</p>
            <div className="confirm-button">
              <a onClick={onClose} className="confirm-ok-button">
                Ok
              </a>
            </div>
          </div>
        );
      }
    })
  }

  render() {
    const { title, form } = this.props;
    const { getFieldProps } = form;
    const errorSection = this.renderErrorSection(this.interests.name);
    return (
      <React.Fragment>
        <form
          className={styles['form']}
          onSubmit={(e: any) => {
            e.preventDefault();
          }}
        >
          <div className="container">
          {/* <div style={{display:'flex', justifyContent:'center'}}>
            <h2 className="text-center com-form-title">{title}</h2>
            <i className='fa fa-question-circle' 
            onClick={this.onClickQuestion}
            style={{color:'#39a0e8', marginLeft:10, marginTop:3, fontSize:18}}/>
            </div> */}
            <div style={{ marginBottom: 10, display: 'flex', justifyContent:'space-between'}}>
            <div style={{display:'flex', marginTop: 13}}>
              <h5 className={styles['about-title']} style={{ display: 'inline-block' }}>
              PERSONAL INTERESTS
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
              <div className="col-12 text-left">
                <EnhancedTagInput
                  placeHolder="Enter interest (ex: football)"
                  {...getFieldProps(this.interests.name, this.interests.options)}
                />

                {this.state.requireMessage ? (
                  <div className={styles['error-group']}>
                    <FormError text={this.state.requireMessage} />
                  </div>
                ) : null}

                {errorSection ? (
                  <div className={styles['error-group']}>{this.renderErrorSection(this.interests.name)}</div>
                ) : null}
              </div>
            </div>
            {/* <div className={`d-flex justify-content-center ${styles['save-button']}`}>
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

export default InterestForm;
