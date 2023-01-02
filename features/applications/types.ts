export type ApplicationStatus =
  | "active"
  | "invited"
  | "accepted"
  | "rejected"
  | "inactive";

export interface Application {
  id: number;
  title: string;
  date: string;
  updatedAt: string;
  job: Job;
  student: Student;
  status: ApplicationStatus;
}
export interface ApplicationResponse {
  id: number;
  date: string;
  modified: string;
  job: Job;
  student: Student;
  title: {
    rendered: string;
  };
  meta: {
    status: ApplicationStatus;
  };
}

export interface Job {
  id: number;
  title: string;
  date: string;
}

export interface Student {
  id: number;
  email: string;
  username: string;
  name: string;
  roles: string[];
}

export interface ApplicationsFilters {
  order?: string;
  orderby?: string;
  search?: string;
  page?: number;
  jobs?: string;
}
