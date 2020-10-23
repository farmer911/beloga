import React, { Component } from 'react';
import styles from './login-form.module.scss';
import { LoadingButton } from '../../_buttons';
import { FormError } from '../../form-error/form-error';
import { RegexConst } from '../../../../commons/constants';

interface LoginFormPropTypes {
  form: any;
  handleSubmitAction: any;
  isLoading: boolean;
  onUsernameForResend: Function;
}

class LoginForm extends Component<LoginFormPropTypes, {}> {
  username = {
    name: 'username',
    label: 'Username or email',
    placeholder: 'Username or email',
    options: {
      initialValue: '',
      rules: [{ required: true, message: 'Email is required' }]
    }
  };
  password = {
    name: 'password',
    label: 'Password',
    placeholder: 'Password',
    options: {
      initialValue: '',
      rules: [{ required: true, message: 'Password is required' }]
    }
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    const { form, handleSubmitAction, isLoading, onUsernameForResend } = this.props;
    form.validateFields((error: any, value: any) => {
      if (!error) {
        !isLoading && handleSubmitAction(value);
        onUsernameForResend(value);
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
    const { isLoading } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className="login-form">
        <div className="row">
          <div className="col-md-12 text-left">
            <label>{this.username.label}</label>
            <input
              type="text"
              placeholder={this.username.placeholder}
              autoFocus
              {...getFieldProps(this.username.name, this.username.options)}
            />
            <div>{this.renderErrorSection(this.username.name)}</div>
          </div>
          <div className="col-md-12 text-left">
            <label>Password</label>
            <input
              type="password"
              placeholder={this.password.placeholder}
              {...getFieldProps(this.password.name, this.password.options)}
            />
            <div>{this.renderErrorSection(this.password.name)}</div>
          </div>
          <div className={`col-md-12 d-flex justify-content-center ${styles['button-wrapper']}`}>
            <LoadingButton
              isLoading={isLoading}
              className={`btn btn--primary type--uppercase ${styles['margin-top']}`}
              type="submit"
              text="Login"
            />
          </div>
        </div>
      </form>
    );
  }
}

export default LoginForm;
