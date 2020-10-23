import React, { Component } from 'react';
import { FormError } from '../../form-error/form-error';
import { MonthYearRange } from '../../month-year-range/month-year-range';
import styles from './experience-form.module.scss';
import { LoadingButton } from '../../_buttons';
import { ImagePreviewUpload } from '../../image-preview-upload/image-preview-upload';
import { enhanceLocationSelect } from '../../../../HOCs';
import { LocationAutoComplete } from '../../tag-input/location-autocomplete';
import { CompanyInput } from '../../company-input/company-input';
import { RegexConst } from '../../../../commons/constants';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

const EnhancedLocationSelect = enhanceLocationSelect();

interface ExperienceFormPropTypes {
  form: any;
  onSubmit: any;
  isLoading: boolean;
  title: string;
  submitBtnTitle: string;
  onUploadLogo?: any;
  data?: any;
}

class ExperienceForm extends Component<ExperienceFormPropTypes, {}> {
  image = {
    name: 'logoUploader',
    label: 'Logo',
    options: {
      initialValue: {
        image_url: null,
        uploadFile: null
      }
    }
  };

  state = {
    city: '',
    country: '',
    state: '',
    cityName: '',
    countryName: '',
    stateName: '',
    company: '',
    companyName: '',
    isShowValid: false,
    address: '',
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
      company: '',
      companyName: '',
      isShowValid: false,
      address: '',
      isEmptyAddress: false
    });
  };
  title = {
    name: 'title',
    label: 'Title*',
    placeholder: 'Title',
    options: {
      initialValue: '',
      rules: [{ required: true, message: 'Title is required' }]
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

  company = {
    name: 'company',
    label: 'Company*',
    placeholder: 'Company',
    options: {
      initialValue: '',
      rules: [{ required: true, message: 'Company is required' }]
    }
  };

  company_url = {
    name: 'url',
    label: 'URL',
    placeholder: 'example.com',
    options: {
      initialValue: '',
      rules: [
        {
          validator: (rule: any, value: any, callback: any) => {
            const urlCondition = RegexConst.LINK_REGREX;
            if (value == ``) {
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

  timeline = {
    name: 'timeline',
    options: {
      initialValue: {
        fromMonth: 1,
        toMonth: 1,
        fromYear: new Date().getFullYear(),
        toYear: new Date().getFullYear(),
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

  setCompany = (value: string) => {
    const { setFieldsValue } = this.props.form;
    this.setState({ company: value });
    setFieldsValue({
      company: value
    });
  };

  setCompanyLogo = (value: string) => {
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
    const { countryName, cityName, stateName, companyName, address } = this.state;
    const urlCondition = RegexConst.LINK_REGREX;
    let hasError = false;
    form.validateFields((error: any, value: any) => {
      if (value.url == '') {
        value.url = '';
      }
      if (!value.url.match(urlCondition) && value.url !== '') {
        value.url = 'http://' + value.url;
      }
      if (!error) {
        value.city = this.state.city;
        value.city_name = this.state.cityName;
        value.country = this.state.country;
        value.country_name = this.state.countryName;
        value.state = this.state.state;
        value.state_name = this.state.stateName;
        value.company = this.state.company;
        value.company_name = this.state.companyName;
        value.address = this.state.address;
        this.setState({
          isShowValid: false,
          cityName: '',
          countryName: '',
          stateName: '',
          city: '',
          state: '',
          country: '',
          companyName: '',
          company: '',
          address: ''
        });
        if (companyName == '' || !companyName) {
          this.setState({ isShowValid: true });
          hasError = true;
        }
        if (!address || address == '') {
          this.setState({ isShowValid: true, isEmptyAddress: true });
          hasError = true;
        }
        if (hasError) {
          return;
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
    const { stateName, cityName, countryName, companyName } = this.state;
    if (type == 'city' && (cityName == '' || !cityName)) {
      return <FormError key={type} text={'City is required'} />;
    }
    if (type == 'country' && (countryName == '' || !countryName)) {
      return <FormError key={type} text={'Country is required'} />;
    }
    if (type == 'state' && (stateName == '' || !stateName)) {
      return <FormError key={type} text={'State is required'} />;
    }
    if (type == 'company' && (companyName == '' || !companyName)) {
      return <FormError key={type} text={'Company is required'} />;
    }
  };

  componentDidUpdate(prevProps: any) {
    if (prevProps.form != this.props.form) {
      const { form } = this.props;
      if (form) {
        const country = form.getFieldValue('country');
        const city = form.getFieldValue('city');
        const state = form.getFieldValue('state');
        const country_name = form.getFieldValue('country_name');
        const city_name = form.getFieldValue('city_name');
        const state_name = form.getFieldValue('state_name');
        const company = form.getFieldValue('company');
        const company_name = form.getFieldValue('company_name');
        const address = form.getFieldValue('address');
        let _address = '';
        if (address) {
          //this.setLocation('address', address);
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
          company: company ? company : '',
          companyName: company_name ? company_name : '',
          address: _address ? _address : '',
        });
      }
    }
  }

  renderErrorSection = (name: string) => {
    const { getFieldError } = this.props.form;
    const errors = getFieldError(name);
    return errors
      ? errors.map((err: any, index: any) => {
        return <FormError key={index} text={err} />;
      })
      : null;
  };

  // checkLink = () => {
  //   console.logog()
  //   const {
  //     form: { setFieldsValue, getFieldValue }
  //   } = this.props;
  //   if (getFieldValue('url') === 'http://') {
  //     setFieldsValue({ url: '' });
  //   }
  // };
  handleChangeAddress = (address: any) => {
    const { setFieldsValue } = this.props.form;
    this.setState({ address });
    // setFieldsValue({ address: address }); 
    if(!address || address == ''){
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
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { isShowValid, isEmptyAddress } = this.state;
    const { isLoading, title, submitBtnTitle } = this.props;
    const daterangeError = this.renderErrorSection(this.timeline.name);
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

    // Limit the suggestions to show only cities in the US
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
                <div className="form-group col-12 col-md-6 text-left">
                  <label>{this.title.label}</label>
                  <input
                    type="text"
                    placeholder={this.title.placeholder}
                    autoFocus
                    {...getFieldProps(this.title.name, this.title.options)}
                  />
                  <div className="form-group-error col-12 col-md-6">{this.renderErrorSection(this.title.name)}</div>
                </div>
                {/* degree name */}
                {/* <div className="form-group col-12 col-md-6 text-left">
                  <label>{this.company.label}</label>
                  <input
                    type="text"
                    placeholder={this.company.placeholder}
                    {...getFieldProps(this.company.name, this.company.options)}
                  />
                  <div className="col-12 col-md-6">{this.renderErrorSection(this.company.name)}</div>
                </div> */}
                <CompanyInput
                  company={this.state.company}
                  companyName={this.state.companyName}
                  setInputValue={this.setInputValue}
                  setCompany={this.setCompany}
                  setCompanyLogo={this.setCompanyLogo}
                  renderErrorSection={isShowValid ? this.renderErrorAutoComplete : () => { }}
                  getFieldProps={getFieldProps}
                />

                <div className="form-group col-12 col-md-6 text-left">
                  <label>{this.company_url.label}</label>
                  <input
                    type="text"
                    placeholder={this.company_url.placeholder}
                    {...getFieldProps(this.company_url.name, this.company_url.options)}
                  />
                  <div className="form-group-error col-12 col-md-6">
                    {this.renderErrorSection(this.company_url.name)}
                  </div>
                </div>
                <div className="form-group col-12 col-md-6">
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
                  checkboxLabel="Currently Work Here"
                  {...getFieldProps(this.timeline.name, this.timeline.options)}
                />
                {daterangeError ? <div className="form-group-error col-12 col-md-12">{daterangeError}</div> : null}

                {/* description */}
                <div className="form-group col-12 text-left">
                  <label>{this.description.label}</label>
                  <textarea
                    rows={3}
                    placeholder={this.description.placeholder}
                    {...getFieldProps(this.description.name, this.description.options)}
                  />
                  <div className="form-group-error">{this.renderErrorSection(this.description.name)}</div>
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

export default ExperienceForm;
