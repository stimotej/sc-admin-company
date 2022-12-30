export interface Company {
  roles: string[];
  oib_company: string;
  name: string;
  short_name: string;
  id_number: string;
  address: string;
  location: string;
  first_name: string;
  last_name: string;
  oib: string;
  iban: string;
  phone: string;
  mobile: string;
  telefax: string;
  email: string;
}

export interface Job {
  id: number;
  allowedSc: boolean;
  featured: boolean;
  title: string;
  company: Company;
  type: string;
  location: string;
  start: string;
  end: string;
  paymentRate: number;
  paymentRateMax: number;
  workHours: number;
  positions: number;
  activeUntil: string;
  description: string;
  whyMe: string;
  requiredSkills: string[];
  optionalSkills: string[];
  date: string;
  updatedAt: string;
}

export interface JobResponse {
  id: number;
  company: Company;
  date: string;
  modified: string;
  meta: {
    job_allowed_sc: boolean;
    job_featured: boolean;
    job_title: string;
    job_type: string;
    job_location: string;
    job_start: string;
    job_end: string;
    job_payment_rate: number;
    job_payment_rate_max: number;
    job_work_hours: number;
    job_positions: number;
    job_active_until: string;
    job_description: string;
    job_why_me: string;
    job_required_skills: string[];
    job_optional_skills: string[];
  };
}

export interface JobsFilters {
  order?: string;
  orderby?: string;
  search?: string;
  page?: number;
}
