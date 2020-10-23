export interface ExperienceType {
  id: string;
  title: string;
  company?: string;
  company_name?: string;
  location: string;
  from_date_month: Months;
  from_date_year: number;
  currently_work_here: boolean;
  to_date_month?: Months;
  to_date_year?: number;
  description?: string;
  image_url?: string;
  country?: string;
  city?: string;
  state?: string;
  country_name?: string;
  city_name?: string;
  state_name?: string;
  url?: string;
}

enum Months {
  January = 'January',
  February = 'February',
  March = 'March',
  April = 'April',
  May = 'May',
  June = 'June',
  July = 'July',
  August = 'August',
  September = 'September',
  October = 'October',
  November = 'November',
  December = 'December'
}
