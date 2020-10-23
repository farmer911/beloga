import React, { Component } from 'react';
import { maskPhoneInput } from '../../../utils';
import { RegexConst } from '../../../commons/constants';
import styles from './contact-form.module.scss';
import { FormError, LoadingButton } from '../../../commons/components';

interface ContactFormPropsType {
  form: any;
  actionSubmit: any;
  isLoading: boolean;
  errorFromServer: string;
}

export class ContactForm extends Component<ContactFormPropsType> {
  state = { classAlert: 'alert--dismissed' };

  handleOnSubmit = (e: any) => {
    e.preventDefault();
    const { actionSubmit } = this.props;
    this.setState({ classAlert: 'alert--dismissed' });
    this.props.form.validateFields((error: any, value: any) => {
      if (!error) {
        const response = actionSubmit(value);
        if (response) {
          this.props.form.resetFields();
          this.setState({ classAlert: '' });
        }
      }
    });
  };

  closeAlert = () => {
    this.setState({ classAlert: 'alert--dismissed' });
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

  maskPhoneInput = (e: any) => {
    e.target.value = maskPhoneInput(e.target.value);
  };

  firstname = {
    label: 'First name*',
    type: 'text',
    name: 'first_name',
    placeholder: 'First name',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'First name is required.',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };

  lastname = {
    label: 'Last name*',
    type: 'text',
    name: 'last_name',
    placeholder: 'Last name',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Last name is required.',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };

  email = {
    label: 'Email Address*',
    type: 'text',
    name: 'email',
    placeholder: 'Email',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Email is required.',
          transform: (value: string) => value.trim()
        },
        {
          validator: (rule: any, value: any, callback: any) => {
            const emailCondition = RegexConst.EMAIL_REGREX;
            if (value.match(emailCondition) || value === '') {
              callback();
              return;
            }
            callback('Email is not valid.');
          }
        }
      ]
    }
  };

  phone = {
    name: 'phone',
    type: 'text',
    label: 'Phone',
    placeholder: '(XXX) XXX-XXXX',
    options: {
      initialValue: '',
      rules: [
        {
          len: 14,
          message: 'Phone number is not valid'
        }
      ]
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
      errorFromServer
    } = this.props;
    return (
      <form onSubmit={this.handleOnSubmit} className="text-left form-email row mx-0">
        <div className="col-md-6">
          <span>{this.firstname.label}</span>
          <input
            type={this.firstname.type}
            placeholder={this.firstname.placeholder}
            autoFocus
            tabIndex={1}
            {...getFieldProps(this.firstname.name, this.firstname.options)}
          />
          {this.renderErrorSection(this.firstname.name)}
        </div>
        <div className="col-md-6">
          <span>{this.lastname.label}</span>
          <input
            type={this.lastname.type}
            placeholder={this.lastname.placeholder}
            tabIndex={2}
            {...getFieldProps(this.lastname.name, this.lastname.options)}
          />
          {this.renderErrorSection(this.lastname.name)}
        </div>
        <div className="col-md-6">
          <span>{this.email.label}</span>
          <input
            type={this.email.type}
            placeholder={this.email.placeholder}
            tabIndex={3}
            {...getFieldProps(this.email.name, this.email.options)}
          />
          {this.renderErrorSection(this.email.name)}
        </div>
        <div className="col-md-6">
          <span>{this.phone.label}</span>
          <input
            type={this.phone.type}
            onInput={this.maskPhoneInput}
            placeholder={this.phone.placeholder}
            tabIndex={4}
            {...getFieldProps(this.phone.name, this.phone.options)}
          />
          {this.renderErrorSection(this.phone.name)}
        </div>
        <div className="col-md-12">
          <span>{this.message.label}</span>
          <textarea
            type={this.message.type}
            placeholder={this.message.placeholder}
            tabIndex={5}
            {...getFieldProps(this.message.name, this.message.options)}
            className="validate-required"
          />
          {this.renderErrorSection(this.message.name)}
        </div>
        <div className="col-12">
          <FormError text={errorFromServer} />
        </div>
        <div className="col-md-12 boxed">
          <LoadingButton
            isLoading={isLoading}
            className={`btn btn--primary type--uppercase ${styles['margin-top']}`}
            type="submit"
            text="Submit"
            tabIndex={6}
            handleClick={this.handleOnSubmit}
          />
        </div>
        <div className={`col-md-12 boxed ${styles['no-top-bottom']}`}>
          <div className={`alert bg--success ${this.state.classAlert}`}>
            <div className="alert__body">
              <span>Thank you for your message. It has been sent.</span>
            </div>
            <div className="alert__close" onClick={this.closeAlert}>
              ×
            </div>
          </div>
        </div>
      </form>
    );
  }
}
