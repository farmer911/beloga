import React, { Component } from 'react';
import { EmploymentStatusEnum, SeekingStatusEnum } from '../../../../commons/types';
import { FormError, Modal, ImageWithButton } from '../../../../commons/components';
import { AvatarUploader } from '../../../../commons/components/';
import styles from './information-form.module.scss';
import { enhanceLocationSelect } from '../../../../HOCs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LocationAutoComplete } from '../../tag-input/location-autocomplete';
import PlacesAutocomplete from 'react-places-autocomplete';
import { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';

import { parsePhoneNumberFromString, AsYouType, getCountryCallingCode, CountryCode } from 'libphonenumber-js';
import moment from 'moment';

interface InformationFormPropTypes {
  form: any;
  handleUploadAvatar: any;
  renderErrorAutoComplete: any;
  setShowValid: any;
  isShowValid: boolean;
  getInputProps: any;
}

let avatarDefault = '/images/avatar.jpg';
class InformationForm extends Component<InformationFormPropTypes, {}> {
  address = {
    name: 'address',
    label: 'Current Location*',
    placeholder: 'Current Location',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Current Location is required',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };

  job_title = {
    name: 'job_title',
    label: 'Job Title or Posittion*',
    placeholder: 'Job Title or Posittion',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Job Title or Posittion is required',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };

  date_of_birth = {
    name: 'date_of_birth',
    label: 'Date of birth*',
    placeholder: 'Date of birth',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Date of birth is required.',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };
  phone = {
    name: 'phone',
    label: 'Phone*',
    placeholder: 'Phone Number',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: ' Phone is required'
        }
      ]
    }
  };

  employmentStatus = {
    name: 'employment_status',
    label: 'Employment Status*',
    placeholder: 'Employment Status',
    options: {
      initialValue: 'Full Time',
      rules: [
        {
          type: 'enum',
          enum: [...Object.keys(EmploymentStatusEnum).map((key: any) => key)]
        },
        { required: true }
      ]
    }
  };

  seekingStatus = {
    name: 'seeking_status',
    label: 'Seeking Status*',
    placeholder: 'Seeking Status',
    options: {
      initialValue: SeekingStatusEnum.Active,
      rules: [
        {
          type: 'enum',
          enum: [...Object.keys(SeekingStatusEnum).map((key: any) => SeekingStatusEnum[key])]
        },
        { required: true }
      ]
    }
  };

  state = {
    preview: avatarDefault,
    src: '',
    isModalOpen: false,
    date_of_birth: '',
    inValidAge: false,
    isEmptyDate: true,
    city: '',
    country: '',
    state: '',
    cityName: '',
    countryName: '',
    stateName: '',
    countryCode: undefined,
    phone: { value: '', maxLength: 20, isValid: false, error: '' },
    isEmptyPhone: false,
    job_title: '',
    isEmptyJobtitle: false,
    _address: '',
    isEmptyAddress: false
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
    } else if (type == 'address') {
      this.setState({ address: inputValue });
      setFieldsValue({
        address: inputValue
      });
    }
  };
  handleChangeAddress = (address:any) => {
    const { setFieldsValue } = this.props.form;
    this.setState({_address: address});
      setFieldsValue({
        address: address
      });
     
  };

  handleSelect = (address: any) => {
    const { setFieldsValue } = this.props.form;
    let _sefl = this;
    _sefl.setState({address});
    setFieldsValue({
      address: address
      });
    geocodeByAddress(address)
      .then(function(results: any) {
        const addressDetail = results[0].address_components;
        if (addressDetail) {
          for (let i = 0; i < addressDetail.length; i++) {
            if (addressDetail[i].types[0] == 'locality') {
              _sefl.setState({ cityName: addressDetail[i].long_name });
              setFieldsValue({
                city_name: addressDetail[i].long_name
              });
            }
            if (addressDetail[i].types[0] == 'administrative_area_level_1') {
              _sefl.setState({ stateName: addressDetail[i].long_name });
              setFieldsValue({
                state_name: addressDetail[i].long_name
              });
            }
            if (addressDetail[i].types[0] == 'country') {
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

  setCountryCode = (code: string) => {
  const { setFieldsValue } = this.props.form;
    if (code !== '' && code !== this.state.countryCode) {
      this.setState({ countryCode: code, phone: { value: '' }, isEmptyPhone : true });
      setFieldsValue({
        phone:''
      });
    }
  };

  onClose = () => {
    this.setState({ preview: '' });
  };

  onCrop = (preview: string) => {
    this.setState({ preview });
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

  renderErrorAutoComplete = (type: string) => {
    if (type == 'city') {
      return <FormError key={type} text={'City is required'} />;
    }
    if (type == 'country') {
      return <FormError key={type} text={'Country is required'} />;
    }  if (type == 'state') {
      return <FormError key={type} text={'State is required'} />;
    }
  };

  getCountryCodeOrDefault(code?: string) {
    return (code ? code : 'US') as CountryCode;
  }

  maskPhoneInput = (e: any) => {
    const { setFieldsValue } = this.props.form;
    const { countryCode } = this.state;
    let callingCode = '+1';
    try {
      const countryCallingCode = getCountryCallingCode(this.getCountryCodeOrDefault(countryCode));
      callingCode = '+' + countryCallingCode.toString();
    } catch (err) {}
    if (e.target.value !== '') {
      let inputValue = e.target.value;
      inputValue = inputValue.replace(/\s+/g, '');
      const maxLength = inputValue.length;
      if (this.state.phone.isValid && maxLength > this.state.phone.maxLength) {
        e.target.value = this.state.phone.value;
        let inputValue = e.target.value;
        inputValue = inputValue.replace(/\s+/g, '');
        const maxLength = inputValue.length;
        this.setState({ phone: { value: e.target.value, isValid: true, maxLength: maxLength, error: '' } });

        setFieldsValue({ phone: e.target.value });
      } else {
        const phoneNumber = parsePhoneNumberFromString(e.target.value, this.getCountryCodeOrDefault(countryCode));
        if (phoneNumber && phoneNumber.number.length > 0) {
          e.target.value = phoneNumber.formatInternational();
          this.setState({ phone: { value: e.target.value } });
          setFieldsValue({ phone: e.target.value });
        }

        if (phoneNumber && phoneNumber.isValid()) {
          this.setState({ phone: { value: e.target.value, isValid: true, maxLength: maxLength, error: '' } });
        } else {
          this.setState({ phone: { value: e.target.value, isValid: false, error: 'Phone number is not valid' } });
        }
      }
    }
    if (e.target.value === '' || e.target.value === callingCode || e.target.value.length <= callingCode.length) {
      e.target.value = callingCode;
      this.setState({ phone: { value: e.target.value, isValid: false, error: 'Phone number is not valid' } });
      setFieldsValue({ phone: e.target.value });
    }
  };

  checkPhone = (event: any) => {
    const { setFieldsValue } = this.props.form;
    const { countryCode } = this.state;
    let callingCode = '+1';
    try {
      const countryCallingCode = getCountryCallingCode(this.getCountryCodeOrDefault(countryCode));
      callingCode = '+' + countryCallingCode.toString();
    } catch (err) {}
    if (this.state.phone.value === callingCode) {
      this.setState({ phone: { value: '' },isEmptyPhone: true });
      setFieldsValue({ phone: '' });
    } else {
      this.setState({isEmptyPhone: false})
    }
  };
  focusPhone = () => {
    const { setFieldsValue } = this.props.form;
    const { countryCode } = this.state;
    let callingCode = '+1';
    try {
      const countryCallingCode = getCountryCallingCode(this.getCountryCodeOrDefault(countryCode));
      callingCode = '+' + countryCallingCode.toString();
    } catch (err) {}
    if (this.state.phone.value === '') {
      setFieldsValue({ phone: callingCode });
      return this.setState({
        phone: { value: callingCode }
      });
    }
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  onUploadAvatar = () => {
    const { handleUploadAvatar } = this.props;
    const { setFieldsValue } = this.props.form;
    const { preview } = this.state;
    handleUploadAvatar(preview);
    setFieldsValue({
      image_url: preview
    });
    this.toggleModal();
  };
  handleChange = (date: Date) => {
    const { setFieldsValue } = this.props.form;
    if (!date) {
      this.setValueBirthday(null);
      return this.setState({
        date_of_birth: null,
        isEmptyDate: true
      });
    }
    const yearNow = new Date().getFullYear();
    const yearChange = date.getFullYear();
    const ageInfo = yearNow - yearChange;
    let value = null;
    if (ageInfo < 13 || ageInfo > 99) {
      this.setState({
        inValidAge: true,
        date_of_birth: null,
        isEmptyDate: true
      });
    } else {
      this.setState({
        inValidAge: false,
        date_of_birth: date,
        isEmptyDate: false
      });
      const currentMonth = date.getMonth() + 1;
      value = date.getFullYear() + '/' + currentMonth + '/' + date.getDate();
    }
    this.setValueBirthday(value);
  };

  setValueBirthday = (val: any) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      date_of_birth: val
    });
  };
  autoMoveCaretAtEnd = (e: any) => {
    let temp_value = e.target.value
    e.target.value = ''
    e.target.value = temp_value
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.form != this.props.form) {
      const country_name = this.props.form.getFieldValue('country_name');
      const city_name = this.props.form.getFieldValue('city_name');
      const state_name = this.props.form.getFieldValue('state_name');
      const country = this.props.form.getFieldValue('country');
      const state = this.props.form.getFieldValue('state');
      const city = this.props.form.getFieldValue('city');
      const address = this.props.form.getFieldValue('address');
      const phone_number = this.props.form.getFieldValue('phone');
      let _address = '' ;
      if(address){
        _address = address;
      }
      this.setState({
        countryName: country_name ? country_name : '',
        cityName: city_name ? city_name : '',
        stateName: state_name ? state_name : '',
        country: country ? country : '',
        state: state ? state : '',
        city: city ? city : '',
        _address: _address ? _address : ''
      });
      if (!address && this.props.isShowValid) {
        this.setState({
          address: null,
          isEmptyAddress: true
        });
      } else {
        this.setState({
          address: address.value,
          isEmptyAddress: false
        });
      }
      const job_title = this.props.form.getFieldProps('job_title');
      if (!job_title.value && this.props.isShowValid) {
        this.setState({
          job_title: null,
          isEmptyJobtitle: true
        });
      } else {
        this.setState({
          job_title: job_title.value,
          isEmptyJobtitle: false
        });
      }
      const date_of_birth = this.props.form.getFieldProps('date_of_birth');
      if (!date_of_birth.value && this.props.isShowValid) {
        this.setState({
          date_of_birth: '',
          isEmptyDate: true
        });
      } else if (date_of_birth.value) {
        this.setState({
          date_of_birth: new Date(date_of_birth.value),
          isEmptyDate: false
        });
      } else {
        this.setState({
          date_of_birth: '',
          isEmptyDate: false
        });
      }
      if (phone_number && this.state.phone.value === '' ) {
        this.setState({ phone: { value: phone_number } });
      }
      if (this.state.phone.value === '' && this.props.isShowValid) {
        this.setState({
          phone: { value: '' },
          isEmptyPhone: true
        });
      }
    }
    if (!this.state.countryCode) {
      this.setState({ countryCode: 'US' });
    }
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { src, isModalOpen, inValidAge, date_of_birth, isEmptyDate, isEmptyJobtitle, isEmptyAddress, isEmptyPhone } = this.state;
    const renderInput = ({ getInputProps, getSuggestionItemProps, suggestions }: any) => (
      <div className="autocomplete-root">
        <input
          className="form-control"
          {...getInputProps()}
          placeholder="Ex: Philadelphia, Pennsylvania, United States"
        />
        <div className={`autocomplete-dropdown-container ${suggestions.length>0 ? "has-location" : ""}`}>
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
      componentRestrictions: { country: '' }
    };
    return (
      <form>
        <div className="row">
          {/* avatar */}
          <div className="col-12">
            {/* <span>Avatar</span> */}
            <Modal isOpen={isModalOpen} toggleModal={this.toggleModal} className="avatar-uploader-modal">
              <AvatarUploader
                src={src}
                preview={this.state.preview}
                onClose={this.onClose}
                onCrop={this.onCrop}
                onSubmit={this.onUploadAvatar}
              />
            </Modal>
            <div className={styles['avatar-wrapper']}>
              <ImageWithButton
                isFormControl={true}
                imgWidth={150}
                imgHeight={150}
                shape="round"
                btnText="edit"
                handleBtnClick={this.toggleModal}
                {...getFieldProps('image_url', {
                  initialValue: avatarDefault
                })}
              />
            </div>
          </div>

          <div className="form-group col-12 col-md-6">
            <span>Current Location*</span>
            <PlacesAutocomplete
              value={this.state._address}
              onChange={this.handleChangeAddress}
              onSelect={this.handleSelect}
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

                <div style={{display:'none'}}>
          <LocationAutoComplete
            country={this.state.country}
            state={this.state.state}
            countryName={this.state.countryName}
            stateName={this.state.stateName}
            cityName={this.state.cityName}
            setInputValue={this.setInputValue}
            city={this.state.city}
            setLocation={this.setLocation}
            setCountryCode={this.setCountryCode}
            renderErrorSection={this.props.isShowValid ? this.props.renderErrorAutoComplete : () => {}}
            getFieldProps={getFieldProps}
          />
          <input
                    type="text"
                    {...this.props.form.getFieldProps('address')}
                />
          </div>
          
          {/* job title */}
          <div className="form-group col-12 col-md-6">
            <span>{this.job_title.label}</span>
            <input
              type="text"
              placeholder={this.job_title.placeholder}
              {...getFieldProps(this.job_title.name, this.job_title.options)}
            />
            <div className="form-group-error">
              {isEmptyJobtitle ? (
                <div className="custom-form-error text-danger">{this.job_title.options.rules[0].message}</div>
              ) : (
                this.renderErrorSection(this.job_title.name)
              )}
            </div>
          </div>
          {/* age */}
          <div className="form-group col-12 col-md-6">
            <span>{this.date_of_birth.label}</span>
            <div className={styles['input-age']}>
              <DatePicker
                selected={isEmptyDate ? '' : date_of_birth}
                dateFormat="MM/dd/yyyy"
                onChange={this.handleChange}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate={
                  new Date(
                    moment()
                      .subtract(99, 'years')
                      .format('MM/DD/YYYY')
                  )
                }
                maxDate={
                  new Date(
                    moment()
                      .subtract(13, 'years')
                      .format('MM/DD/YYYY')
                  )
                }
              />
              {inValidAge ? <span className={styles['span-age']}>Age must be between 13 and 99</span> : null}
              <div className="form-group-error">{this.renderErrorSection(this.date_of_birth.name)}</div>
            </div>
            <div className="form-group-error">
              {isEmptyDate ? (
                <div className="custom-form-error text-danger">{this.date_of_birth.options.rules[0].message}</div>
              ) : (
                this.renderErrorSection(this.date_of_birth.name)
              )}
            </div>
          </div>
          {/* phone number */}
          <div className="form-group col-12 col-md-6">
            <span>{this.phone.label}</span>
            <input
              type="text"
              onInput={this.maskPhoneInput}
              placeholder={this.phone.placeholder}
              onFocus={() => {
                this.focusPhone();
              }}
              onKeyPress={this.autoMoveCaretAtEnd}
              value={this.state.phone.value}
              onBlur={e => this.checkPhone(e)}
              tabIndex={5}
              {...getFieldProps(this.phone.name)}
            />
            {isEmptyPhone ? (
              <div className="form-group-error">
                <div className="custom-form-error text-danger">{this.phone.options.rules[0].message}</div>
              </div>
              ) : (
                this.renderErrorSection(this.phone.name)
              )}
            {!this.state.phone.isValid ? (
              <div className="form-group-error">
                <div className="custom-form-error text-danger">{this.state.phone.error}</div>
              </div>
            ) : null}
          </div>
          {/* Employment status */}
          <div className="form-group col-12 col-md-6">
            <span>{this.employmentStatus.label}</span>
            <select
              className="custom-select"
              {...getFieldProps(this.employmentStatus.name, this.employmentStatus.options)}
            >
              {Object.keys(EmploymentStatusEnum).map((option: any, index: any) => {
                return (
                  <option key={index} value={option}>
                    {EmploymentStatusEnum[option]}
                  </option>
                );
              })}
            </select>
            <div className="form-group-error">{this.renderErrorSection(this.employmentStatus.name)}</div>
          </div>
          {/* Seeking status */}
          <div className="form-group col-12 col-md-6">
            <span>{this.seekingStatus.label}</span>
            <select className="custom-select" {...getFieldProps(this.seekingStatus.name, this.seekingStatus.options)}>
              {Object.keys(SeekingStatusEnum).map((option: any, index: any) => {
                return (
                  <option key={index} value={SeekingStatusEnum[option]}>
                    {SeekingStatusEnum[option]}
                  </option>
                );
              })}
            </select>
            <div className="form-group-error">{this.renderErrorSection(this.seekingStatus.name)}</div>
          </div>
        </div>
      </form>
    );
  }
}

export default InformationForm;
