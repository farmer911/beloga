import { BaseType } from '../base/base.type';

export interface EducationType extends BaseType {
  school: number;
  school_name: string;
  description: string;
  degree_name: string;
  from_date_month: string;
  from_date_year: number;
  currently_work_here: boolean;
  to_date_month?: string;
  to_date_year?: number;
  gpa?: number;
  image_url?: string;
}
