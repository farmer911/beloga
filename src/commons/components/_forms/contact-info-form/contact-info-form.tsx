import React, { Component } from 'react';
import { FormError } from '../../form-error/form-error';
import styles from './contact-info-form.module.scss';
import { RegexConst } from '../../../../commons/constants';
import { maskPhoneInput } from '../../../../utils';
import { userInfo } from 'os';

interface ContactInfoFormPropTypes {
  form: any;
  handleSubmit: any;
  isLoading: boolean;
  title: string;
  submitBtnTitle: string;
  size?: 'small' | 'big';
  isOpen: boolean;
  userInfo: any;
  checkValidUsernameAction: any;
  linkedDefault: string;
  facebookDefault: string;
  twitterDefault: string;
  instagramDefault: string;
}

export class ContactInfoForm extends Component<ContactInfoFormPropTypes, {}> {
  state = {
    linkedinUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: ''
  };
  constructor(props: any) {
    super(props);
    this.state = {
      linkedinUrl: '',
      facebookUrl: '',
      twitterUrl: '',
      instagramUrl: ''
    };
  }

  linkedDefault = 'https://linkedin.com/in/';
  facebookDefault = 'https://www.facebook.com/';
  twitterDefault = 'https://twitter.com/';
  instagramDefault = 'https://www.instagram.com/';
  username = {
    name: 'username',
    label: 'Username*',
    placeholder: 'username',
    options: {
      initialValue: '',
      rules: [
        { required: true, message: 'Username name is required' },
        {
          transform: (value: string) => value.trim(),
          validator: (rule: any, value: any, callback: any) => {
            const { checkValidUsernameAction, userInfo } = this.props;
            const conditionUsername = /^[A-Za-z0-9@.+\-_]+$/g;
            if (value === '' || value === userInfo.username) {
              callback();
              return;
            }
            if (value.match(conditionUsername)) {
              checkValidUsernameAction(value, callback);
              return;
            }
            callback('Username input contains no characters specified!');
          }
        }
      ]
    }
  };

  componentDidMount() {
    const { userInfo } = this.props;
    if (userInfo != undefined || userInfo != null) {
      const { facebook, instagram, twitter, linkedin } = userInfo;
      this.setState({
        linkedinUrl: linkedin,
        facebookUrl: facebook,
        twitterUrl: twitter,
        instagramUrl: instagram
      });
    }
  }
  linkedin = {
    name: 'linkedin',
    label: 'Linkedin',
    placeholder: 'https://linkedin.com/in/username'
    // options: {
    //   rules: [
    //     {
    //       transform: (value: string) => value.trim(),
    //       validator: (rule: any, value: any, callback: any) => {
    //         if (val.match(RegexConst.LINK_REGREX) || val === '') {
    //           callback();
    //           return;
    //         }
    //         callback('URL is not valid');
    //       }
    //     }
    //   ]
    // }
  };
  facebook = {
    name: 'facebook',
    label: 'Facebook',
    placeholder: 'https://www.facebook.com/profile.php?id',
    options: {
      // rules: [
      //   {
      //     transform: (value: string) => value.trim(),
      //     validator: (rule: any, value: any, callback: any) => {
      //       if (value.match(RegexConst.LINK_REGREX) || value === '') {
      //         callback();
      //         return;
      //       }
      //       callback('URL is not valid');
      //     }
      //   }
      // ]
    }
  };
  twitter = {
    name: 'twitter',
    label: 'Twitter',
    placeholder: 'https://twitter.com/username',
    options: {
      initialValue: ''
      // rules: [
      //   {
      //     transform: (value: string) => value.trim(),
      //     validator: (rule: any, value: any, callback: any) => {
      //       if (value.match(RegexConst.LINK_REGREX) || value === '') {
      //         callback();
      //         return;
      //       }
      //       callback('URL is not valid');
      //     }
      //   }
      // ]
    }
  };
  instagram = {
    name: 'instagram',
    label: 'Instagram',
    placeholder: 'https://www.instagram.com/username',
    options: {
      initialValue: ''
      // rules: [
      //   {
      //     transform: (value: string) => value.trim(),
      //     validator: (rule: any, value: any, callback: any) => {
      //       if (value.match(RegexConst.LINK_REGREX) || value === '') {
      //         callback();
      //         return;
      //       }
      //       callback('URL is not valid');
      //     }
      //   }
      // ]
    }
  };
  portfolio = {
    name: 'portfolio',
    label: 'Website / Portfolio',
    placeholder: 'http://your-portfolio.com',
    options: {
      initialValue: '',
      rules: [
        {
          transform: (value: string) => value.trim(),
          validator: (rule: any, value: any, callback: any) => {
            if (value.match(RegexConst.LINK_REGREX) || value === '') {
              callback();
              return;
            }
            callback('URL is not valid');
          }
        }
      ]
    }
  };
  phone = {
    name: 'phone',
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
  email = {
    name: 'email',
    label: 'Email'
  };

  maskPhoneInput = (e: any) => {
    e.target.value = maskPhoneInput(e.target.value);
  };

  handleOnSubmit = (e: any) => {
    e.preventDefault();
    const { form, handleSubmit } = this.props;
    form.validateFields((error: any, value: any) => {
      if (!error) {
        const mappedValue = { user: { username: value.username }, ...value };
        mappedValue.facebook = this.state.facebookUrl;
        mappedValue.linkedin = this.state.linkedinUrl;
        mappedValue.twitter = this.state.twitterUrl;
        mappedValue.instagram = this.state.instagramUrl;
        handleSubmit(mappedValue);
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

  changeLink = (type: string, event: any) => {
    switch (type) {
      case 'linkedin':
        return this.setState({ linkedinUrl: event.target.value });
        break;
      case 'facebook':
        return this.setState({ facebookUrl: event.target.value });
        break;
      case 'twitter':
        return this.setState({ twitterUrl: event.target.value });
        break;
      case 'instagram':
        return this.setState({ instagramUrl: event.target.value });
        break;
      default:
        return;
    }
  };
  checkLink = (type: string, event: any) => {
    switch (type) {
      case 'linkedin':
        if (this.state.linkedinUrl == this.linkedDefault) {
          this.setState({ linkedinUrl: '' });
        }
        break;
      case 'facebook':
        if (this.state.facebookUrl == this.facebookDefault) {
          this.setState({ facebookUrl: '' });
        }
        break;
      case 'twitter':
        if (this.state.twitterUrl == this.twitterDefault) {
          this.setState({ twitterUrl: '' });
        }
        break;
      case 'instagram':
        if (this.state.instagramUrl == this.instagramDefault) {
          this.setState({ instagramUrl: '' });
        }
        break;
      default:
        return;
    }
  };
  focusLink = (type: string) => {
    switch (type) {
      case 'linkedin':
        if (this.state.linkedinUrl == '') {
          return this.setState({
            linkedinUrl: this.linkedDefault
          });
        }
        break;
      case 'facebook':
        if (this.state.facebookUrl == '') {
          return this.setState({
            facebookUrl: this.facebookDefault
          });
        }
        break;
      case 'twitter':
        if (this.state.twitterUrl == '') {
          return this.setState({
            twitterUrl: this.twitterDefault
          });
        }
        break;
      case 'instagram':
        if (this.state.instagramUrl == '') {
          return this.setState({
            instagramUrl: this.instagramDefault
          });
        }
        break;
      default:
        return;
    }
  };

  componentDidUpdate(prevProps: any) {
    if (this.props.userInfo && prevProps.userInfo !== this.props.userInfo) {
      const {
        userInfo: { facebook, instagram, twitter, linkedin }
      } = this.props;
      this.setState({
        linkedinUrl: linkedin,
        facebookUrl: facebook,
        twitterUrl: twitter,
        instagramUrl: instagram
      });
    }
  }
  render() {
    const { getFieldProps } = this.props.form;
    const { linkedinUrl, facebookUrl, twitterUrl, instagramUrl } = this.state;
    const { title } = this.props;
    return (
      <div className="container">
        <h2 className="text-center com-form-title">{title}</h2>
        <form onSubmit={this.handleOnSubmit}>
          <div className="row">
            {/*username */}
            <div className="form-group col-12 col-md-12 text-left">
              <span>{this.username.label}</span>
              <input
                type="text"
                placeholder={this.username.placeholder}
                {...getFieldProps(this.username.name, this.username.options)}
              />
              <div>{this.renderErrorSection(this.username.name)}</div>
            </div>
            {/*linkedin */}
            <div className="form-group col-12 col-md-12 text-left">
              <span>{this.linkedin.label}</span>
              <input
                onFocus={() => {
                  this.focusLink('linkedin');
                }}
                onChange={e => this.changeLink('linkedin', e)}
                value={this.state.linkedinUrl}
                onBlur={e => this.checkLink('linkedin', e)}
                type="text"
                placeholder={this.linkedin.placeholder}
                // {...getFieldProps(this.linkedin.name, this.linkedin.options)}
              />
              <div>{this.renderErrorSection(this.linkedin.name)}</div>
            </div>
            {/* facebook */}
            <div className="form-group col-12 col-12 text-left">
              <span>{this.facebook.label}</span>
              <input
                onFocus={() => {
                  this.focusLink('facebook');
                }}
                onChange={e => this.changeLink('facebook', e)}
                value={this.state.facebookUrl}
                onBlur={e => this.checkLink('facebook', e)}
                type="text"
                placeholder={this.facebook.placeholder}
                // {...getFieldProps(this.facebook.name, this.facebook.options)}
              />
              <div>{this.renderErrorSection(this.facebook.name)}</div>
            </div>
            {/* twitter */}
            <div className="form-group col-12 col-12 text-left">
              <span>{this.twitter.label}</span>
              <input
                onFocus={() => {
                  this.focusLink('twitter');
                }}
                onChange={e => this.changeLink('twitter', e)}
                value={this.state.twitterUrl}
                onBlur={e => this.checkLink('twitter', e)}
                type="text"
                placeholder={this.twitter.placeholder}
                // {...getFieldProps(this.twitter.name, this.twitter.options)}
              />
              <div>{this.renderErrorSection(this.twitter.name)}</div>
            </div>
            {/* instagram */}
            <div className="form-group col-12 col-12 text-left">
              <span>{this.instagram.label}</span>
              <input
                onFocus={() => {
                  this.focusLink('instagram');
                }}
                onChange={e => this.changeLink('instagram', e)}
                value={this.state.instagramUrl}
                onBlur={e => this.checkLink('instagram', e)}
                type="text"
                placeholder={this.instagram.placeholder}
                // {...getFieldProps(this.instagram.name, this.instagram.options)}
              />
              <div>{this.renderErrorSection(this.instagram.name)}</div>
            </div>
            {/* Portfolio */}
            <div className="form-group col-12 col-12 text-left">
              <span>{this.portfolio.label}</span>
              <input
                type="text"
                placeholder={this.portfolio.placeholder}
                {...getFieldProps(this.portfolio.name, this.portfolio.options)}
              />
              <div>{this.renderErrorSection(this.portfolio.name)}</div>
            </div>
            {/* phone */}
            {/* <div className="form-group col-12 col-12 text-left">
                  <span>{this.phone.label}</span>
                  <input
                    type="text"
                    onInput={this.maskPhoneInput}
                    placeholder={this.phone.placeholder}
                    {...getFieldProps(this.phone.name, this.phone.options)}
                  />
                  <div>{this.renderErrorSection(this.phone.name)}</div>
                </div> */}
            <div className={`form-group col-md-12 d-flex justify-content-center margin-top-20`}>
              <button className="btn-save-form" type="submit">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
