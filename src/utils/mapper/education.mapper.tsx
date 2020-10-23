import { MONTHS } from '../../commons/constants';

export const apiToForm = (data: any) => {
  const formData = {
    school: data.school,
    school_name: data.school_name,
    // location: data.location || '',
    degree_name: data.degree_name,
    description: data.description,
    gpa: data.gpa,
    address: data.address,
    country: data.country,
    state: data.state,
    city: data.city,
    country_name: data.country_name,
    state_name: data.state_name,
    city_name: data.city_name,
    url: data.url,
    logoUploader: {
      image_url: data.image_url,
      uploadFile: undefined
    },
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
    school: formData.school,
    school_name: formData.school_name,
    // location: formData.location,
    currently_work_here: formData.timeline.currentlyWorkHere,
    degree_name: formData.degree_name,
    description: formData.description,
    gpa: formData.gpa,
    from_date_month: MONTHS[formData.timeline.fromMonth - 1],
    from_date_year: formData.timeline.fromYear,
    to_date_month: formData.timeline.toMonth === null ? null : MONTHS[formData.timeline.toMonth - 1],
    to_date_year: formData.timeline.toYear,
    address: formData.address,
    country: formData.country,
    state: formData.state,
    city: formData.city,
    country_name: formData.country_name,
    state_name: formData.state_name,
    city_name: formData.city_name,
    url: formData.url
  };
  return apiData;
};
