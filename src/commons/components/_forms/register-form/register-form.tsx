import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RegexConst } from '../../../../commons/constants';
import styles from './register-form.module.scss';
import { LoadingButton } from '../../_buttons';
import { FormError } from '../../form-error/form-error';
import { confirmAlert } from 'react-confirm-alert';

interface RegisterFormPropsType {
  form: any;
  actionSubmit: any;
  isLoading: boolean;
  errorFromServer: string;
  actionCheckEmail: any;
  actionCheckUsername: any;
}

class RegisterForm extends Component<RegisterFormPropsType> {

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

  firstname = {
    label: 'First name*',
    type: 'text',
    name: 'firstname',
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
    name: 'lastname',
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

  username = {
    label: 'Username*',
    type: 'text',
    name: 'username',
    placeholder: 'Username',
    options: {
      initialValue: '',
      rules: [
        {
          max: 30,
          message: 'Maximum length is not over 30 letters.'
        },
        {
          required: true,
          message: 'Username is required.',
          transform: (value: string) => value.trim()
        },
        {
          validator: (rule: any, value: any, callback: any) => {
            const { actionCheckUsername } = this.props;
            const conditionUsername = /^[A-Za-z0-9@.+\-_]+$/g;

            if (value === '') {
              callback();
              return;
            }
            if (value.match(conditionUsername)) {
              actionCheckUsername(value, callback);
              return;
            }
            callback('Username input not match condition bellow!');
          }
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
            const { actionCheckEmail } = this.props;
            const emailCondition = RegexConst.EMAIL_REGREX;
            if (value === '') {
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

  password = {
    label: 'Password*',
    type: 'password',
    name: 'password1',
    placeholder: 'Password',
    options: {
      initialValue: '',
      rules: [
        {
          min: 8,
          message: 'Password must be at least 8 characters'
        },
        { required: true, message: 'Password is required.' },
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
              else if (!value.match(conditionMissSpecial)) {
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
    name: 'password2',
    placeholder: 'Confirm Password',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Password confirmation is required.'
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

  passwordSuggestions = () => {
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>
              <div>
                <p className="type--fine-print no-margin-bottom">Your password can't be too similar to your other personal information.</p>
                <p className="type--fine-print no-margin-bottom">Your password must contain at least 8 characters.</p>
                <p className="type--fine-print no-margin-bottom">Your password can't be a commonly used password.</p>
                <p className="type--fine-print no-margin-bottom">Your password can't be entirely numeric.</p>
                <p className="type--fine-print no-margin-bottom">Password must contain a special character.</p>
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
  }

  render() {
    const {
      form: { getFieldProps, setFieldsInitialValue },
      isLoading,
      errorFromServer
    } = this.props;
    return (
      <div className="w-100 d-flex justify-content-center">
        <div className="col-12 col-sm-12">
          <div className="switchable__text">
            <form onSubmit={this.handleOnSubmit}>
              <div className="row">
                <div className="col-lg-6 col-md-12">
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
                <div className="col-lg-6 col-md-12">
                  <span>{this.lastname.label}</span>
                  <input
                    type={this.lastname.type}
                    placeholder={this.lastname.placeholder}
                    tabIndex={2}
                    {...getFieldProps(this.lastname.name, this.lastname.options)}
                  />
                  {this.renderErrorSection(this.lastname.name)}
                </div>
                <div className="col-12">
                  <span>{this.username.label}</span>
                  <input
                    type={this.username.type}
                    placeholder={this.username.placeholder}
                    tabIndex={3}
                    {...getFieldProps(this.username.name, this.username.options)}
                  />
                  {this.renderErrorSection(this.username.name)}
                  <span className="type--fine-print">
                    <i>Required 30 characters or fewer. Letters, digits and @/./+/-/_ only</i>
                  </span>
                </div>
                <div className="col-12">
                  <span>{this.email.label}</span>
                  <input
                    type={this.email.type}
                    placeholder={this.email.placeholder}
                    tabIndex={4}
                    {...getFieldProps(this.email.name, this.email.options)}
                  />
                  {this.renderErrorSection(this.email.name)}
                </div>
                <div className="col-12">
                  <span>{this.password.label} </span>
                  <span className="password-suggestions" onClick={this.passwordSuggestions}>(?)</span>
                  <input
                    type={this.password.type}
                    placeholder={this.password.placeholder}
                    tabIndex={5}
                    {...getFieldProps(this.password.name, this.password.options)}
                  />
                  {this.renderErrorSection(this.password.name)}
                </div>
                <div className="col-12">
                  <span>{this.passwordConfirm.label}</span>
                  <input
                    type={this.passwordConfirm.type}
                    placeholder={this.passwordConfirm.placeholder}
                    tabIndex={6}
                    {...getFieldProps(this.passwordConfirm.name, this.passwordConfirm.options)}
                  />
                  {this.renderErrorSection(this.passwordConfirm.name)}
                  <span className="type--fine-print"><i>Enter the same password as before, for vertification.</i></span>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <FormError text={errorFromServer} />
                </div>
                <div className="col-12 d-flex justify-content-center">
                  <LoadingButton
                    isLoading={isLoading}
                    className={`btn btn--primary type--uppercase ${styles['margin-top']}`}
                    type="submit"
                    text="Register"
                    tabIndex={7}
                    handleClick={this.handleOnSubmit}
                  />
                </div>
                <div className="col-12 text-center">
                  <span className="type--fine-print">
                    Login to your account <Link to="/login">Sign in</Link>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
