import React, { Component } from 'react';
import { enhanceTagInput } from '../../../HOCs';

const EnhancedTagInput = enhanceTagInput();
export class LocationAutoComplete extends Component<any, any> {
  render() {
    return (
      <React.Fragment>
        <div className="form-group col-12 col-md-6">
          <span>{'Country*'}</span>
          <EnhancedTagInput
            placeHolder="Country"
            isShowLogoSearch={false}
            type={'country'}
            country={this.props.country}
            state={this.props.state}
            countryName={this.props.countryName}
            setInputValue={this.props.setInputValue}
            city={this.props.city}
            setLocation={this.props.setLocation}
            setCountryCode={this.props.setCountryCode}
            {...this.props.getFieldProps('country')}
            {...this.props.getFieldProps('country_name')}
          />
          <div className="form-group-error">
            {/* {this.props.countryName == '' || !this.props.countryName ? this.props.renderErrorSection('country') : null} */}
          </div>
        </div>
        {/* state */}
        <div className="form-group col-12 col-md-6">
          <span>{'State*'}</span>
          <EnhancedTagInput
            placeHolder="State"
            type={'state'}
            country={this.props.country}
            state={this.props.state}
            stateName={this.props.stateName}
            city={this.props.city}
            setInputValue={this.props.setInputValue}
            setLocation={this.props.setLocation}
            isShowLogoSearch={false}
            setCountryCode={this.props.setCountryCode}
            {...this.props.getFieldProps('state')}
            {...this.props.getFieldProps('state_name')}
          />
          <div className="form-group-error">
            {/* {this.props.stateName == '' || !this.props.stateName ? this.props.renderErrorSection('state') : null} */}
          </div>
        </div>
        {/* city */}
        <div className="form-group col-12 col-md-6">
          <span>{'City*'}</span>
          <EnhancedTagInput
            placeHolder="City"
            cityName={this.props.cityName}
            type={'city'}
            setLocation={this.props.setLocation}
            setInputValue={this.props.setInputValue}
            country={this.props.country}
            state={this.props.state}
            city={this.props.city}
            isShowLogoSearch={false}
            setCountryCode={this.props.setCountryCode}
            {...this.props.getFieldProps('city')}
            {...this.props.getFieldProps('city_name')}
          />
          <div className="form-group-error">
            {/* {this.props.cityName == '' || !this.props.cityName ? this.props.renderErrorSection('city') : null} */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
