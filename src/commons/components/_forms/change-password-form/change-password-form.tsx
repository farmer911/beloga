import React, { Component } from 'react';
import { RegexConst } from '../../../../commons/constants';
import styles from './change-password-form.module.scss';
import { LoadingButton } from '../../_buttons';
import { FormError } from '../../form-error/form-error';
import { Alert } from '../../alert/alert';

interface ChangePasswordFormPropsType {
  form: any;
  actionSubmit: any;
  isLoading: boolean;
  errorChangePassword: any;
}

class ChangePasswordForm extends Component<ChangePasswordFormPropsType> {
  handleOnSubmit = (e: any) => {
    e.preventDefault();
    const { actionSubmit } = this.props;
    this.props.form.validateFields((error: any, value: any) => {
      if (!error) {
        actionSubmit(value);
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

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.errorChangePassword === 'New password has been saved.') {
      nextProps.form.resetFields();
    }
  }

  currentPassword = {
    label: 'Current Password*',
    type: 'password',
    name: 'old_password',
    placeholder: 'Current Password',
    options: {
      initialValue: '',
      rules: [{ required: true, message: 'Current password is required.' }]
    }
  };

  password = {
    label: 'New Password*',
    type: 'password',
    name: 'new_password1',
    placeholder: 'Password',
    options: {
      initialValue: '',
      rules: [
        {
          min: 8,
          message: 'Password must be at least 8 characters'
        },
        { required: true, message: 'New password is required.' },
        { 
          validator: (rule: any, value: any, callback: any) => {
            const { validateFields, isFieldTouched } = this.props.form;
            if (isFieldTouched(this.passwordConfirm.name)) {
              validateFields([this.passwordConfirm.name], {
                force: true
              });
            }
            const conditionOneLetter = RegexConst.SAME_CHARACTER_REGEX;
            const conditionPassword = RegexConst.ONLY_NUMERIC_REGEX;
            const conditionMissSpecial = RegexConst.MISS_CHARACTER_SPECIAL;
            if (!value.match(conditionPassword)) {
              if (value.match(conditionOneLetter)) {
                callback('Password is too common.');
              }
              else if(!value.match(conditionMissSpecial)) {
                callback('Password must contain a special character.')
              }
              callback();
              return;
            }
            callback("Password input can't be entirely numeric!");
          }
        }
      ]
    }
  };

  passwordConfirm = {
    label: 'Confirm Password*',
    type: 'password',
    name: 'new_password2',
    placeholder: 'New Confirm Password',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'New password confirmation is required.'
        },
        {
          validator: (rule: any, value: any, callback: any) => {
            const { getFieldValue } = this.props.form;
            const inputPassword = getFieldValue(this.password.name);
            if (value !== inputPassword) {
              callback('Confirm password does not match!');
              return;
            }
            callback();
          }
        }
      ]
    }
  };

  render() {
    const {
      form: { getFieldProps },
      isLoading,
      errorChangePassword
    } = this.props;
    return (
      <div className="row d-flex justify-content-center">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <div className="switchable__text">
            <form onSubmit={this.handleOnSubmit}>
              <div className="row">
                <div className="form-group col-12">
                  {errorChangePassword.message && errorChangePassword.isError ? (
                    <Alert type="alert" message={errorChangePassword.message} />
                  ) : null}
                  {errorChangePassword.message && !errorChangePassword.isError ? (
                    <Alert type="success" message={errorChangePassword.message} />
                  ) : null}
                </div>
                <div className="form-group col-12">
                  <span>{this.currentPassword.label}</span>
                  <input
                    type={this.currentPassword.type}
                    placeholder={this.currentPassword.placeholder}
                    tabIndex={10}
                    {...getFieldProps(this.currentPassword.name, this.currentPassword.options)}
                  />
                  {this.renderErrorSection(this.currentPassword.name)}
                </div>
                <div className="form-group col-12">
                  <span>{this.password.label}</span>
                  <input
                    type={this.password.type}
                    placeholder={this.password.placeholder}
                    tabIndex={11}
                    {...getFieldProps(this.password.name, this.password.options)}
                  />
                  {this.renderErrorSection(this.password.name)}
                </div>
                <div className="form-group col-12">
                  <span>{this.passwordConfirm.label}</span>
                  <input
                    type={this.passwordConfirm.type}
                    placeholder={this.passwordConfirm.placeholder}
                    tabIndex={12}
                    {...getFieldProps(this.passwordConfirm.name, this.passwordConfirm.options)}
                  />
                  {this.renderErrorSection(this.passwordConfirm.name)}
                </div>
              </div>
              <div className={`${styles['padding-side']} row`}>
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <LoadingButton
                    isLoading={isLoading}
                    className={`btn-save-form`}
                    type="submit"
                    text="Save"
                    tabIndex={13}
                    handleClick={this.handleOnSubmit}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ChangePasswordForm;
