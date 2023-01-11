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
  city: string;
  workStart: string;
  workEnd: string;
  paymentRate: number;
  paymentRateMax: number;
  workHours: number;
  positions: number;
  activeUntil: string;
  description: string;
  whyMe: string;
  skills: string[];
  labels: string[];
  applications: number;
  date: string;
  updatedAt: string;
}

export interface JobResponse {
  id: number;
  company: Company;
  date: string;
  modified: string;
  applications: number;
  meta: {
    allowed_sc: boolean;
    featured: boolean;
    title: string;
    type: string;
    city: string;
    work_start: string;
    work_end: string;
    payment_rate: number;
    payment_rate_max: number;
    work_hours: number;
    positions: number;
    active_until: string;
    description: string;
    why_me: string;
    skills: string[];
    labels: string[];
  };
}

export interface JobsFilters {
  order?: string;
  orderby?: string;
  search?: string;
  page?: number;
}
