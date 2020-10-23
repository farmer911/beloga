import React, { Component } from 'react';
import { enhanceCompanyInput } from '../../../HOCs';

const EnhancedCompanyInput = enhanceCompanyInput();
export class CompanyInput extends Component<any, any> {
  render() {
    return (
      <React.Fragment>
        <div className="form-group col-12 col-md-6">
          <span>{'Company*'}</span>
          <EnhancedCompanyInput
            placeHolder="Company"
            isShowLogoSearch={false}
            type={'company'}
            company={this.props.company}
            companyName={this.props.companyName}
            setInputValue={this.props.setInputValue}
            setCompany={this.props.setCompany}
            setCompanyLogo={this.props.setCompanyLogo}
            {...this.props.getFieldProps('company')}
            {...this.props.getFieldProps('company_name')}
          />
          <div className="form-group-error">
            {this.props.companyName === '' || !this.props.companyName ? this.props.renderErrorSection('company') : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
