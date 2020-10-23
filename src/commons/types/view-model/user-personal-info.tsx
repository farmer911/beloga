import { EmploymentStatusEnum } from '../enums/employment-status.enum';
import { SeekingStatusEnum } from '../enums/seeking-status.enum';

export interface UserPersonalInfoType {
  location: string;
  age: number;
  phone: number;
  employmentStatus: EmploymentStatusEnum;
  seekingStatus: SeekingStatusEnum;
}
