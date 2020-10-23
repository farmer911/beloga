import { EmploymentStatusEnum, SeekingStatusEnum } from '../enums';

export interface UserType {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  location: string;
  age: string;
  phone: string;
  employment_status: EmploymentStatusEnum;
  seeking_status: SeekingStatusEnum;
  image_url: string;
  resume_url: string;
  username: string;
  video_url: string;
  cover_image_url: string;
  job_video_url: string;
  job_cover_image_url: string;
  school_video_url: string;
  school_cover_image_url: string;
  country_name?: string;
  state_name?: string;
  city_name?: string;
  is_social?: boolean;
}
