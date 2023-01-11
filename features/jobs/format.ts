import type { Job, JobResponse } from "./types";

const formatJob = (job: JobResponse): Job => ({
  id: job.id,
  allowedSc: job.meta.allowed_sc,
  featured: job.meta.featured,
  title: job.meta.title,
  company: job.company,
  type: job.meta.type,
  city: job.meta.city,
  workStart: job.meta.work_start,
  workEnd: job.meta.work_end,
  paymentRate: job.meta.payment_rate,
  paymentRateMax: job.meta.payment_rate_max,
  workHours: job.meta.work_hours,
  positions: job.meta.positions,
  activeUntil: job.meta.active_until,
  description: job.meta.description,
  whyMe: job.meta.why_me,
  skills: job.meta.skills,
  labels: job.meta.labels,
  applications: job.applications,
  date: job.date,
  updatedAt: job.modified,
});

export default formatJob;
