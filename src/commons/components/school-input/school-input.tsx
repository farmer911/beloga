import React, { Component } from 'react';
import { enhanceSchoolInput } from '../../../HOCs';

const EnhancedSchoolInput = enhanceSchoolInput();
export class SchoolInput extends Component<any, any> {
  render() {
    return (
      <React.Fragment>
        <div className="form-group col-12 col-md-6">
          <span>{'School*'}</span>
          <EnhancedSchoolInput
            placeHolder="School"
            isShowLogoSearch={false}
            type={'school'}
            school={this.props.school}
            schoolName={this.props.schoolName}
            setInputValue={this.props.setInputValue}
            setSchool={this.props.setSchool}
            setSchoolLogo={this.props.setSchoolLogo}
            {...this.props.getFieldProps('school')}
            {...this.props.getFieldProps('school_name')}
          />
          <div className="form-group-error">
            {this.props.schoolName === '' || !this.props.schoolName ? this.props.renderErrorSection('school') : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
