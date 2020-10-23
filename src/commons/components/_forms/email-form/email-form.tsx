import React, { Component } from 'react';
import { FormError } from '../../form-error/form-error';
import { RegexConst } from '../../../../commons/constants';
import styles from './email-form.module.scss';

interface EmailPropTypes {
  userInfo: any;
  form: any;
  handleSubmitAction: any;
  title: string;
  actionCheckEmail: any;
}

export class EmailForm extends Component<EmailPropTypes, {}> {
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
            const { actionCheckEmail, userInfo } = this.props;
            const emailCondition = RegexConst.EMAIL_REGREX;
            if (value === '' || value === userInfo.email) {
              callback();
              return;
            }
            if (value.match(emailCondition)) {
              actionCheckEmail(value, callback);
            } else {
              callback('Email is not valid.');
            }
          }
        }
      ]
    }
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    const { form, handleSubmitAction } = this.props;
    form.validateFields((error: any, value: any) => {
      if (!error) {
        const response = handleSubmitAction(value);
      }
    });
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

  render() {
    const { getFieldProps } = this.props.form;
    const { title } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={styles['form-change-email']}>
        <div className="row">
          <div className="col-md-12 text-center">
            <h3 className="no-margin-bottom">{title}</h3>
            <span className={styles['warning']}>
            If you change your email address, you must re-activate this account through the new email. You will be logged out of your current account but will not lose any profile information.
            </span>
          </div>

          <div className={`form-group col-12 col-md-12 ${styles['email-group']}`}>
            <span className="input-label">{this.email.label}</span>
            <input
              type={this.email.type}
              placeholder={this.email.placeholder}
              tabIndex={3}
              {...getFieldProps(this.email.name, this.email.options)}
            />
            {this.renderErrorSection(this.email.name)}
          </div>
          <div className={`col-md-12 d-flex justify-content-center align-items-center`}>
            <button type="submit" className="btn-save-form">
              Save
            </button>
          </div>
        </div>
      </form>
    );
  }
}
