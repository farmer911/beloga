import { BaseType } from '../base/base.type';

export interface ContactType extends BaseType {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
}
