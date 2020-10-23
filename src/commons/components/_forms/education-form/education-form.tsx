import React, { Component } from 'react';
import styles from './education-form.module.scss';
import { FormError } from '../../form-error/form-error';
import { LoadingButton } from '../../_buttons';
import { MonthYearRange } from '../../month-year-range/month-year-range';
import { ImagePreviewUpload } from '../../image-preview-upload/image-preview-upload';
import { SchoolInput } from '../../school-input/school-input';
import { RegexConst } from '../../../../commons/constants';
import PlacesAutocomplete from 'react-places-autocomplete';
import { LocationAutoComplete } from '../../tag-input/location-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

interface EducationFormPropTypes {
  form: any;
  onSubmit: any;
  isLoading: boolean;
  title: string;
  submitBtnTitle: string;
}

class EducationForm extends Component<EducationFormPropTypes, {}> {
  image = {
    name: 'logoUploader',
    label: 'Logo'
  };

  state = {
    city: '',
    country: '',
    state: '',
    cityName: '',
    countryName: '',
    stateName: '',
    school: '',
    schoolName: '',
    address: '',
    isShowValid: false,
    isEmptyAddress: false
  };
  setInitialState = () => {
    this.setState({
      city: '',
      country: '',
      state: '',
      cityName: '',
      countryName: '',
      stateName: '',
      school: '',
      schoolName: '',
      address: '',
      isShowValid: false,
      isEmptyAddress: false
    });
  };

  schoolName = {
    name: 'school_name',
    label: 'School*',
    placeholder: 'School name',
    options: {
      initialValue: '',
      rules: [{ required: true, message: "School's name is required" }]
    }
  };

  address = {
    name: 'address',
    label: 'Address*',
    placeholder: 'Address',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Address is required',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };

  school_url = {
    name: 'url',
    label: 'URL',
    placeholder: 'example.com',
    options: {
      initialValue: '',
      rules: [
        {
          validator: (rule: any, value: any, callback: any) => {
            const urlCondition = RegexConst.LINK_REGREX;
            if (value == '') {
              callback();
              return;
            }
            if (!value.match(urlCondition)) {
              value = 'http://' + value;
              if (!value.match(urlCondition)) {
              callback('URL is not valid.');
              }
            }
            callback();
            return;
          }
        }
      ]
    }
  };

  degreeName = {
    name: 'degree_name',
    label: 'Degree and Major*',
    placeholder: 'Degree name',
    options: {
      initialValue: '',
      rules: [{ required: true, message: 'Degree is required' }]
    }
  };

  location = {
    name: 'location',
    label: 'Location*',
    placeholder: 'Location',
    options: {
      initialValue: '',
      rules: [{ required: true, message: 'Location is required' }]
    }
  };

  timeline = {
    name: 'timeline',
    placeholder: 'Location',
    options: {
      initialValue: {
        fromMonth: 1,
        toMonth: 1,
        fromYear: 2018,
        toYear: 2018,
        currentlyWorkHere: false
      },
      rules: [
        {
          validator: (rule: any, value: any, callback: any) => {
            const { fromMonth, toMonth, fromYear, toYear, currentlyWorkHere } = value;
            if (fromYear < toYear || currentlyWorkHere) {
              callback();
              return;
            }
            if (fromYear > toYear) {
              callback('Your end date can’t be earlier than your start date.');
            }
            if (fromYear === toYear && fromMonth > toMonth) {
              callback('Your end date can’t be earlier than your start date.');
            }

            callback();
            return;
          }
        }
      ]
    }
  };

  gpa = {
    name: 'gpa',
    label: 'GPA',
    placeholder: 'GPA',
    options: {
      initialValue: '',
      rules: [
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value) {
              const intValue = Number(value.toString().trim());
              if (value && isNaN(value)) {
                callback('GPA must be an integer');
              }
              if ((value && intValue < 1) || intValue > 10) {
                callback('GPA must be between 1 and 10');
              }
            }
            callback();
            return;
          }
        }
      ]
    }
  };

  description = {
    name: 'description',
    label: 'Description',
    placeholder: 'Description',
    options: {
      initialValue: '',
      rules: []
    }
  };

  setInputValue = (type: string, inputValue: string) => {
    const { setFieldsValue } = this.props.form;
    if (type == 'school') {
      this.setState({ schoolName: inputValue });
      setFieldsValue({
        school_name: inputValue
      });
    }
    if (type == 'country') {
      this.setState({ countryName: inputValue });
      setFieldsValue({
        country_name: inputValue
      });
    } else if (type == 'state') {
      this.setState({ stateName: inputValue });
      setFieldsValue({
        state_name: inputValue
      });
    } else if (type == 'city') {
      this.setState({ cityName: inputValue });
      setFieldsValue({
        city_name: inputValue
      });
    } else if (type == 'company') {
      this.setState({ companyName: inputValue });
      setFieldsValue({
        company_name: inputValue
      });
    }
    else if (type == 'address') {
      this.setState({ address: inputValue });
      setFieldsValue({
        address: inputValue
      });
    }
  };

  setSchool = (value: string) => {
    const { setFieldsValue } = this.props.form;
    this.setState({ school: value });
    setFieldsValue({
      school: value
    });
  };

  setSchoolLogo = (value: string) => {
    const {
      form: { setFieldsValue }
    } = this.props;
    if (value) {
      setFieldsValue({ logoUploader: { image_url: value } });
    }
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    const { form, onSubmit, isLoading } = this.props;

    const { school, schoolName, address } = this.state;
    const urlCondition = RegexConst.LINK_REGREX;
    let hasError = false;
    if (schoolName == '') {
      this.setState({ isShowValid: true });
      hasError = true;
    }
    form.validateFields((error: any, value: any) => {
      if (value.url == '') {
        value.url = '';
      }
      if (!value.url.match(urlCondition) && value.url !== '') {
        value.url = 'http://' + value.url;
      }
      if (hasError) {
        return;
      }
      if (!error) {
        value.city = this.state.city;
        value.city_name = this.state.cityName;
        value.country = this.state.country;
        value.country_name = this.state.countryName;
        value.state = this.state.state;
        value.state_name = this.state.stateName;
        value.school = this.state.school;
        value.school_name = this.state.schoolName;
        value.address = this.state.address;
        this.setState({
          isShowValid: false,
          schoolName: '',
          school: '',
          address: '',
          cityName: '',
          countryName: '',
          stateName: '',
          city: '',
          state: '',
          country: ''
        });
        if (value.gpa === '') {
          value.gpa = null;
        }
        if (!address || address == '') {
          this.setState({ isShowValid: true, isEmptyAddress: true });
          hasError = true;
        }
        if (value[this.image.name]) {
          const { uploadFile } = value[this.image.name];
          !isLoading && onSubmit(value, uploadFile);
        } else {
          !isLoading && onSubmit(value);
        }
      }
    });
  };

  renderErrorAutoComplete = (type: string) => {
    const { schoolName, stateName, cityName, countryName } = this.state;
    if (type == 'school' && (schoolName == '' || !schoolName)) {
      return <FormError key={type} text={'School is required'} />;
    }
    if (type == 'city' && (cityName == '' || !cityName)) {
      return <FormError key={type} text={'City is required'} />;
    }
    if (type == 'country' && (countryName == '' || !countryName)) {
      return <FormError key={type} text={'Country is required'} />;
    }
    if (type == 'state' && (stateName == '' || !stateName)) {
      return <FormError key={type} text={'State is required'} />;
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

  componentDidUpdate(prevProps: any) {
    if (prevProps.form != this.props.form) {
      const { form } = this.props;
      if (form) {
        const school = form.getFieldValue('school');
        const school_name = form.getFieldValue('school_name');
        const country = form.getFieldValue('country');
        const city = form.getFieldValue('city');
        const state = form.getFieldValue('state');
        const country_name = form.getFieldValue('country_name');
        const city_name = form.getFieldValue('city_name');
        const state_name = form.getFieldValue('state_name');
        const address = form.getFieldValue('address');
        let _address = '';
        if (address) {
          _address = address;
        } else {
          _address = (country_name == undefined || country_name == '') ? '' : `${city_name}, ${state_name}, ${country_name}`;
        }
        this.setState({
          countryName: country_name ? country_name : '',
          cityName: city_name ? city_name : '',
          stateName: state_name ? state_name : '',
          country: country ? country : '',
          state: state ? state : '',
          city: city ? city : '',
          school: school ? school : '',
          schoolName: school_name ? school_name : '',
          address: _address ? _address : ''
        });
      }
    }
  }

  // focusLink = () => {
  //   const {
  //     form: { setFieldsValue, getFieldValue }
  //   } = this.props;
  //   if (getFieldValue('url') === '') {
  //     setFieldsValue({ url: 'http://' });
  //   }
  // };

  // checkLink = () => {
  //   const {
  //     form: { setFieldsValue, getFieldValue }
  //   } = this.props;
  //   if (getFieldValue('url') === 'http://') {
  //     setFieldsValue({ url: '' });
  //   }
  // };

  setLocation = (type: string, value: string) => {
    const { setFieldsValue } = this.props.form;
    if (type == 'country') {
      this.setState({ country: value });
      setFieldsValue({
        country: value
      });
    } else if (type == 'state') {
      this.setState({ state: value });
      setFieldsValue({
        state: value
      });
    } else if (type == 'city') {
      this.setState({ city: value });
      setFieldsValue({
        city: value
      });
    }
  };

  handleChangeAddress = (address: any) => {
    const { setFieldsValue } = this.props.form;
    this.setState({ address });
    setFieldsValue({ address: address });
    if (!address || address == '') {
      this.setState({ isEmptyAddress: true });
    } else {
      this.setState({ isEmptyAddress: false });
    }
  };

  handleSelectAddress = (address: any) => {
    const { setFieldsValue } = this.props.form;
    let _sefl = this;
    _sefl.setState({ address });
    setFieldsValue({
      address: address
    });
    geocodeByAddress(address)
      .then(function (results: any) {
        let addressDetail = results[0].address_components;
        if (addressDetail) {
          for (let i = 0; i < addressDetail.length; i++) {
            if (addressDetail[i].types[0] == "locality") {
              _sefl.setState({ cityName: addressDetail[i].long_name });
              setFieldsValue({
                city_name: addressDetail[i].long_name
              });
            }
            if (addressDetail[i].types[0] == "administrative_area_level_1") {
              _sefl.setState({ stateName: addressDetail[i].long_name });
              setFieldsValue({
                state_name: addressDetail[i].long_name
              });
            }
            if (addressDetail[i].types[0] == "country") {
              _sefl.setState({ countryName: addressDetail[i].long_name });
              setFieldsValue({
                country_name: addressDetail[i].long_name
              });
            }
          }
        }
      })
      .catch((error: any) => console.error('Error', error));
  };

  render() {
    const { getFieldProps } = this.props.form;
    const { isLoading, title, submitBtnTitle } = this.props;
    const daterangeError = this.renderErrorSection(this.timeline.name);
    const { isShowValid, isEmptyAddress } = this.state;
    const renderInput = ({ getInputProps, getSuggestionItemProps, suggestions }: any) => (
      <div className="autocomplete-root">
        <input className="form-control" {...getInputProps()} placeholder="Ex: Philadelphia, Pennsylvania, United States" value={this.state.address} />
        <div className={`autocomplete-dropdown-container ${suggestions.length > 0 ? "has-location" : ""}`}>
          {suggestions.map((suggestion: any) => (
            // <!-- Add a style of "suggestion" to the suggested locations -->
            <div {...getSuggestionItemProps(suggestion)} className="suggestion">
              <span>{suggestion.description}</span>
            </div>
          ))}
        </div>
      </div>
    );
    const searchOptions = {
      types: ['(cities)'],
      componentRestrictions: { country: "" }
    }
    return (
      <div className="row">
        <div className="col-md-12">
          <form className={styles['form']} onSubmit={this.handleSubmit}>
            <div style={{ margin: -10 }}>
              <h2 className="text-center com-form-title">{title}</h2>
              <div className="row">
                <div className="form-group col-12">
                  <ImagePreviewUpload {...getFieldProps(this.image.name)} />
                </div>
                {/* school name */}
                {/* <div className="form-group col-12 col-md-12 text-left">
                  <label>{this.schoolName.label}</label>
                  <input
                    type="text"
                    placeholder={this.schoolName.placeholder}
                    autoFocus
                    {...getFieldProps(this.schoolName.name, this.schoolName.options)}
                  />
                  <div>{this.renderErrorSection(this.schoolName.name)}</div>
                </div> */}
                <SchoolInput
                  school={this.state.school}
                  schoolName={this.state.schoolName}
                  setInputValue={this.setInputValue}
                  setSchool={this.setSchool}
                  setSchoolLogo={this.setSchoolLogo}
                  renderErrorSection={isShowValid ? this.renderErrorAutoComplete : () => { }}
                  getFieldProps={getFieldProps}
                />
                <div className="form-group col-12 col-md-6 text-left">
                  <label>{this.school_url.label}</label>
                  <input
                    type="text"
                    placeholder={this.school_url.placeholder}
                    {...getFieldProps(this.school_url.name, this.school_url.options)}
                  />
                  <div className="form-group-error col-12 col-md-6">
                    {this.renderErrorSection(this.school_url.name)}
                  </div>
                </div>
                {/* degree name */}
                <div className="form-group col-12 col-md-6 text-left">
                  <label>{this.degreeName.label}</label>
                  <input
                    type="text"
                    placeholder={this.degreeName.placeholder}
                    {...getFieldProps(this.degreeName.name, this.degreeName.options)}
                  />
                  <div>{this.renderErrorSection(this.degreeName.name)}</div>
                </div>
                <div className="form-group col-12 col-md-6 text-left">
                  <span>Location*</span>
                  <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.handleChangeAddress}
                    onSelect={this.handleSelectAddress}
                    // Pass the search options prop
                    searchOptions={searchOptions}
                    debounce={800}
                  >
                    {renderInput}
                  </PlacesAutocomplete>
                  <div className="form-group-error">
                    {isEmptyAddress ? (
                      <div className="custom-form-error text-danger">{this.address.options.rules[0].message}</div>
                    ) : (
                        this.renderErrorSection(this.address.name)
                      )}
                  </div>
                </div>
                <div style={{ display: 'none' }}>
                  <LocationAutoComplete
                    country={this.state.country}
                    state={this.state.state}
                    countryName={this.state.countryName}
                    stateName={this.state.stateName}
                    cityName={this.state.cityName}
                    setInputValue={this.setInputValue}
                    city={this.state.city}
                    address={this.state.address}
                    setLocation={this.setLocation}
                    renderErrorSection={isShowValid ? this.renderErrorAutoComplete : () => { }}
                    getFieldProps={getFieldProps}
                  />
                  <input
                    type="text"
                    {...this.props.form.getFieldProps('address')}
                  />
                </div>
                {/* month year from-to */}
                <MonthYearRange
                  checkboxLabel="Currently study here"
                  {...getFieldProps(this.timeline.name, this.timeline.options)}
                />
                {daterangeError ? <div className="form-group col-12 col-md-12">{daterangeError}</div> : null}

                {/* gpa */}
                <div className="form-group col-12 col-md-6 text-left">
                  <label>{this.gpa.label}</label>
                  <input
                    type="text"
                    placeholder={this.gpa.placeholder}
                    {...getFieldProps(this.gpa.name, this.gpa.options)}
                  />
                  <div>{this.renderErrorSection(this.gpa.name)}</div>
                </div>
                {/* description */}
                <div className="form-group col-12 text-left">
                  <label>{this.description.label}</label>
                  <textarea
                    rows={3}
                    placeholder={this.description.placeholder}
                    {...getFieldProps(this.description.name, this.description.options)}
                  />
                  <div>{this.renderErrorSection(this.description.name)}</div>
                </div>

                <div className={`col-md-12 d-flex justify-content-center ${styles['button-wrapper']}`}>
                  <LoadingButton isLoading={isLoading} type="submit" text="Save" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EducationForm;
