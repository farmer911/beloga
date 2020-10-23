import { MONTHS } from '../../commons/constants';

export const apiToForm = (data: any) => {
  const formData = {
    title: data.title,
    address: data.address,
    location_name: data.location_name,
    location_address: data.location_address,
    description: data.description,
    logoUploader: {
      image_url: data.image_url,
      uploadFile: undefined
    },
    country: data.country,
    state: data.state,
    city: data.city,
    country_name: data.country_name,
    state_name: data.state_name,
    city_name: data.city_name,

    // places: {
    //   selectedCityId: data.city,
    //   selectedCountryId: data.country,
    //   selectedStateId: data.state
    // },
    timeline: {
      fromMonth: MONTHS.indexOf(data.from_date_month) + 1,
      fromYear: data.from_date_year,
      toMonth: MONTHS.lastIndexOf(data.to_date_month) + 1,
      toYear: data.to_date_year,
      currentlyWorkHere: data.currently_work_here
    }
  };
  return formData;
};

export const formToApi = (formData: any) => {
  const apiData = {
    title: formData.title,
    location_name: formData.location_name,
    location_address: formData.location_address,
    description: formData.description,
    currently_work_here: formData.timeline.currentlyWorkHere,
    from_date_month: MONTHS[formData.timeline.fromMonth - 1],
    from_date_year: formData.timeline.fromYear,
    to_date_month: formData.timeline.toMonth === null ? null : MONTHS[formData.timeline.toMonth - 1],
    to_date_year: formData.timeline.toYear,
    address: formData.address,
    country_name: formData.country_name,
    state_name: formData.state_name,
    city_name: formData.city_name,
    // country: formData.places.selectedCountryId,
    // state: formData.places.selectedStateId,
    // city: formData.places.selectedCityId
  };
  return apiData;
};
