import {
  EducationListItem,
  ExperienceListItem,
  CertificationListItem,
  SkillListItem,
  LanguageListItem,
  InterestListItem
} from '../commons/components';
import { educationMapper, experienceMapper, certificateMapper, interestMapper } from './mapper';

export const apiToForm = (ListItemComponent: any) => {
  switch (ListItemComponent) {
    case EducationListItem:
      return educationMapper.apiToForm;

    case ExperienceListItem:
      return experienceMapper.apiToForm;

    case CertificationListItem:
      return certificateMapper.apiToForm;
    case SkillListItem:
      return (data: any) => {
        return {
          skills: [...data]
        };
      };
      case LanguageListItem:
      return (data: any) => {
        return {
          languages: [...data]
        };
      };
    case InterestListItem:
      return interestMapper.apiToForm;
    default:
      return (data: any) => {
        return data;
      };
  }
};

export const formToApi = (ListItemComponent: any) => {
  switch (ListItemComponent) {
    case EducationListItem:
      return educationMapper.formToApi;

    case ExperienceListItem:
      return experienceMapper.formToApi;

    case CertificationListItem:
      return certificateMapper.formToApi;
    case InterestListItem:
      return interestMapper.formToApi;
    default:
      return (data: any) => {
        return data;
      };
  }
};
