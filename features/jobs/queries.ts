const jobKeys = {
  jobs: ["jobs"],
  skills: ["skills"],
  jobsFiltered: (filters: {}) => [...jobKeys.jobs, filters],
  job: (id: number) => [...jobKeys.jobs, id],
};

export default jobKeys;
