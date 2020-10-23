import React, { Component } from 'react';
import { FormError } from '../../../../commons/components';
import { RegexConst } from '../../../../commons/constants';

interface SocialConnectFormPropTypes {
  form: any;
  userInfo: any;
}

class SocialConnectForm extends Component<SocialConnectFormPropTypes> {
  state = {
    linkedinUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: ''
  };
  constructor(props: any) {
    super(props);
  }
  linkedDefault = 'https://linkedin.com/in/';
  facebookDefault = 'https://www.facebook.com/';
  twitterDefault = 'https://twitter.com/';
  instagramDefault = 'https://www.instagram.com/';

  componentDidUpdate(prevProps: any) {
    if (prevProps.userInfo != this.props.userInfo) {
      const {
        userInfo: { facebook, instagram, twitter, linkedin }
      } = this.props;
    }
  }
  portfolio = {
    name: 'portfolio',
    label: 'Website / Portfolio',
    placeholder: 'http://your-portfolio.com',
    options: {
      initialValue: '',
      rules: [
        {
          validator: (rule: any, value: any, callback: any) => {
            const urlCondition = RegexConst.LINK_REGREX;
            if (value === '') {
              callback();
              return;
            }
            if (!value.match(urlCondition)) {
              callback('URL is not valid.');
            }
            callback();
            return;
          }
        }
      ]
    }
  };

  focusLinkPortfolio = () => {
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    if (getFieldValue('portfolio') === '') {
      setFieldsValue({ portfolio: 'http://' });
    }
  };

  checkLinkPortfolio = () => {
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    if (getFieldValue('portfolio') === 'http://') {
      setFieldsValue({ portfolio: '' });
    }
  };

  linkedin = {
    name: 'linkedin',
    label: 'Linkedin',
    placeholder: 'https://linkedin.com/in/username',
    options: {
      initialValue: '',
      rules: [
        {
          validator: (rule: any, value: any, callback: any) => {
            const urlCondition = RegexConst.LINK_REGREX;
            if (value === '') {
              callback();
              return;
            }
            if (!value.match(urlCondition)) {
              callback('URL is not valid.');
            }
            callback();
            return;
          }
        }
      ]
    }
  };
  focusLinkLinkedin = () => {
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    if (getFieldValue('linkedin') === '') {
      setFieldsValue({ linkedin: this.linkedDefault });
    }
  };

  checkLinkLinkedin = () => {
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    if (getFieldValue('linkedin') === this.linkedDefault) {
      setFieldsValue({ linkedin: '' });
    }
  };

  instagram = {
    name: 'instagram',
    label: 'Instagram',
    placeholder: 'https://www.instagram.com/username',
    options: {
      initialValue: '',
      rules: [
        {
          validator: (rule: any, value: any, callback: any) => {
            const urlCondition = RegexConst.LINK_REGREX;
            if (value === '') {
              callback();
              return;
            }
            if (!value.match(urlCondition)) {
              callback('URL is not valid.');
            }
            callback();
            return;
          }
        }
      ]
    }
  };
  focusLinkInstagram = () => {
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    if (getFieldValue('instagram') === '') {
      setFieldsValue({ instagram: this.instagramDefault });
    }
  };

  checkLinkInstagram = () => {
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    if (getFieldValue('instagram') === this.instagramDefault) {
      setFieldsValue({ instagram: '' });
    }
  };

  facebook = {
    name: 'facebook',
    label: 'Facebook',
    placeholder: 'https://www.facebook.com/profile.php?id',
    options: {
      initialValue: '',
      rules: [
        {
          validator: (rule: any, value: any, callback: any) => {
            const urlCondition = RegexConst.LINK_REGREX;
            if (value === '') {
              callback();
              return;
            }
            if (!value.match(urlCondition)) {
              callback('URL is not valid.');
            }
            callback();
            return;
          }
        }
      ]
    }
  };
  focusLinkFacebook = () => {
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    if (getFieldValue('facebook') === '') {
      setFieldsValue({ facebook: this.facebookDefault });
    }
  };

  checkLinkFacebook = () => {
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    if (getFieldValue('facebook') === this.facebookDefault) {
      setFieldsValue({ facebook: '' });
    }
  };

  twitter = {
    name: 'twitter',
    label: 'Twitter',
    placeholder: 'https://twitter.com/username',
    options: {
      initialValue: '',
      rules: [
        {
          validator: (rule: any, value: any, callback: any) => {
            const urlCondition = RegexConst.LINK_REGREX;
            if (value === '') {
              callback();
              return;
            }
            if (!value.match(urlCondition)) {
              callback('URL is not valid.');
            }
            callback();
            return;
          }
        }
      ]
    }
  };
  focusLinkTwitter = () => {
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    if (getFieldValue('twitter') === '') {
      setFieldsValue({ twitter: this.twitterDefault });
    }
  };

  checkLinkTwitter = () => {
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    if (getFieldValue('twitter') === this.twitterDefault) {
      setFieldsValue({ twitter: '' });
    }
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
    return (
      <form>
        <div className="row">
          {/* portfolio */}
          <div className="form-group col-12">
            <span>{this.portfolio.label}</span>
            <input
              type="string"
              placeholder={this.portfolio.placeholder}
              onFocus={() => {
                this.focusLinkPortfolio();
              }}
              onBlur={e => this.checkLinkPortfolio()}
              {...getFieldProps(this.portfolio.name, this.portfolio.options)}
            />
            <div>{this.renderErrorSection(this.portfolio.name)}</div>
          </div>
          {/* linkedin */}
          <div className="form-group col-12">
            <span>{this.linkedin.label}</span>
            <input
              type="string"
              placeholder={this.linkedin.placeholder}
              onFocus={() => {
                this.focusLinkLinkedin();
              }}
              onBlur={e => this.checkLinkLinkedin()}
              {...getFieldProps(this.linkedin.name, this.linkedin.options)}
            />
            <div>{this.renderErrorSection(this.linkedin.name)}</div>
          </div>
          {/* instagram */}
          <div className="form-group col-12">
            <span>{this.instagram.label}</span>
            <input
              type="string"
              placeholder={this.instagram.placeholder}
              onFocus={() => {
                this.focusLinkInstagram();
              }}
              onBlur={e => this.checkLinkInstagram()}
              {...getFieldProps(this.instagram.name, this.instagram.options)}
            />
            <div>{this.renderErrorSection(this.instagram.name)}</div>
          </div>
          {/* facebook */}
          <div className="form-group col-12">
            <span>{this.facebook.label}</span>
            <input
              type="string"
              placeholder={this.facebook.placeholder}
              onFocus={() => {
                this.focusLinkFacebook();
              }}
              onBlur={e => this.checkLinkFacebook()}
              {...getFieldProps(this.facebook.name, this.facebook.options)}
            />
            <div>{this.renderErrorSection(this.facebook.name)}</div>
          </div>
          {/* twitter */}
          <div className="form-group col-12">
            <span>{this.twitter.label}</span>
            <input
              type="string"
              placeholder={this.twitter.placeholder}
              onFocus={() => {
                this.focusLinkTwitter();
              }}
              onBlur={e => this.checkLinkTwitter()}
              {...getFieldProps(this.twitter.name, this.twitter.options)}
            />
            <div>{this.renderErrorSection(this.twitter.name)}</div>
          </div>
        </div>
      </form>
    );
  }
}

export default SocialConnectForm;
