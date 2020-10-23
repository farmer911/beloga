import React, { Component } from 'react';
import { maskPhoneInput } from '../../../utils';
import { RegexConst } from '../../../commons/constants';
import styles from './contact-form.module.scss';
import { FormError, LoadingButton, Modal, Alert } from '../../../commons/components';
import { confirmAlert } from 'react-confirm-alert';

interface ContactFormPropsType {
  form: any;
  actionSubmit: any;
  isLoading: boolean;
  errorFromServer: string;
  userName: any;
  classAlert: boolean
}

export class ContactForm extends Component<ContactFormPropsType> {
  state = { classAlert: false };

  handleOnSubmit = (e: any) => {
    e.preventDefault();
    // this.setState({ classAlert: true });
    this.props.form.validateFields((error: any, value: any) => {
      if (!error  && value.message!='') {
        const { actionSubmit } = this.props;
        const response = actionSubmit(value);
        if (response) {
          this.props.form.resetFields();
        }
      }
    });
    // this.props.form.resetFields();
  };
  

  closeAlert = () => {
    // this.setState({ classAlert: 'alert--dismissed' });
  };
  // componentDidMount() {
  //   const {setFieldsValue} = this.props.form;
  //   const {user_name} = this.props;
  //   console.log('=======')
  //   if(user_name != ''){
  //     console.log('11111111')
  //     return setFieldsValue({url:'www.belooga.com/public/'+user_name});
  //   }
  // }
  renderErrorSection = (name: string) => {
    const { getFieldError } = this.props.form;
    const errors = getFieldError(name);
    return errors
      ? errors.map((err: any, index: any) => {
          return <FormError key={index} text={err} />;
        })
      : null;
  };

  maskPhoneInput = (e: any) => {
    e.target.value = maskPhoneInput(e.target.value);
  };

  
  url = {
    label: 'Belooga Profile URL*',
    type: 'text',
    name: 'profile_url',
    placeholder: 'www.belooga.com/public/...',
    options: {
      initialValue:'www.belooga.com/public/'+this.props.userName,
      rules: [{
          required: true,
          message: 'URL is required.',
          transform: (value: string) => value.trim()
        
      }]
    }
  };
  message = {
    label: 'Your Message*',
    type: 'textarea',
    name: 'message',
    placeholder: 'Your message',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Your message is required.',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };
  render() {
    const {
      form: { getFieldProps },
      isLoading,
      errorFromServer,
      userName,classAlert
    } = this.props;
    return (
      <form onSubmit={this.handleOnSubmit} className="text-left form-email row mx-0">
        <div className="col-md-12 apply-title">APPLY NOW</div>
        <div className="col-md-12">
          <span>{this.url.label}</span>
          <input
            type={this.url.type}
            placeholder={this.url.placeholder}
            tabIndex={6}
            readOnly
            {...getFieldProps(this.url.name, this.url.options)}
          />
          {this.renderErrorSection(this.url.name)}
        </div>
        <div className="col-md-12">
          <span>{this.message.label}</span>
          <textarea
            type={this.message.type}
            placeholder={this.message.placeholder}
            tabIndex={5}
            {...getFieldProps(this.message.name, this.message.options)}
            className="validate-required career-mess"
          />
          {this.renderErrorSection(this.message.name)}
        </div>
        <div className="col-12">
          <FormError text={errorFromServer} />
        </div>
        <div className="col-md-12 boxed">
          <LoadingButton
            isLoading={isLoading}
            className={`btn btn--primary type--uppercase ${styles['margin-top-careers']}`}
            type="submit"
            text="Submit"
            tabIndex={6}
            handleClick={this.handleOnSubmit}
          />
        </div>
        {classAlert &&  <div className="col-md-12 boxed alert-success"> <Alert type="success" message="Thank you for your submission. We will review and get back to you shortly." /></div>}
      </form>
    );
  }
}
