import { MONTHS } from '../../commons/constants';

export const apiToForm = (data: any) => {
  const formData = {
    interests: data.map((interest: any) => interest.name)
  };
  return formData;
};

export const formToApi = (formData: any) => {
  const apiData = {
    interests: formData.interests
  };
  return apiData;
};
