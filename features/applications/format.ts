import type { Application, ApplicationResponse } from "./types";

const formatApplication = (application: ApplicationResponse): Application => ({
  id: application.id,
  title: application.title.rendered,
  job: application.job,
  student: application.student,
  status: application.meta.status,
  date: application.date,
  updatedAt: application.modified,
});

export default formatApplication;
