import React, { Component } from 'react';
import { FormError } from '../../form-error/form-error';

interface AboutPropTypes {
  form: any;
  handleSubmitAction: any;
  title: string;
  handleClose?:any;
}

export class AboutForm extends Component<AboutPropTypes, {}> {
  about = {
    name: 'about',
    label: 'About',
    options: {
      initialValue: '',
      rules: [{ required: true, message: 'About is required' }]
    }
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    const { form, handleSubmitAction } = this.props;
    form.validateFields((error: any, value: any) => {
      if (!error) {
        handleSubmitAction(value);
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

  render() {
    const { getFieldProps } = this.props.form;
    const { title } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">

          <div className="col-md-12 text-left">
          <h5 className='about-title' id="about-title" style={{ display: 'inline-block', marginTop:'13px' }}>ABOUT</h5>
          <span className='cancle-button' style={{float:'right'}}>
                  <i className="fa fa-times-circle" onClick={this.handleClose} />
                  <span className='tooltiptext'>Cancel</span>
                </span>
            <textarea
            style={{marginTop:10}}
              maxLength={400}
              rows={5}
              type="text"
              autoFocus
              {...getFieldProps(this.about.name, this.about.options)}
            />
            <div className="text-right">
              <span>limit: 400 characters</span>
            </div>
            <div>{this.renderErrorSection(this.about.name)}</div>
          </div>
          <div className={`col-md-12 d-flex justify-content-center`}>
            <button type="submit" className="btn-save-form">
              Save
            </button>
          </div>
        </div>
      </form>
    );
  }
}
