import type { Job, JobResponse } from "./types";

const formatJob = (job: JobResponse): Job => ({
  id: job.id,
  allowedSc: job.meta.job_allowed_sc,
  featured: job.meta.job_featured,
  title: job.meta.job_title,
  company: job.company,
  type: job.meta.job_type,
  location: job.meta.job_location,
  start: job.meta.job_start,
  end: job.meta.job_end,
  paymentRate: job.meta.job_payment_rate,
  paymentRateMax: job.meta.job_payment_rate_max,
  workHours: job.meta.job_work_hours,
  positions: job.meta.job_positions,
  activeUntil: job.meta.job_active_until,
  description: job.meta.job_description,
  whyMe: job.meta.job_why_me,
  requiredSkills: job.meta.job_required_skills,
  optionalSkills: job.meta.job_optional_skills,
  applications: job.applications,
  date: job.date,
  updatedAt: job.modified,
});

export default formatJob;
