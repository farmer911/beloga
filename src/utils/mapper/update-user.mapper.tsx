import { MONTHS } from '../../commons/constants';

export const apiToForm = (data: any) => {
  const formData = {
    ...data,
    address: data.address
  };
  return formData;
};

export const formToApi = (formData: any) => {
  const apiData = {
    ...formData,
    user: {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      username: formData.username
    },
    address: formData.address
    // country: formData.places.selectedCountryId,
    // state: formData.places.selectedStateId,
    // city: formData.places.selectedCityId
  };
  return apiData;
};
