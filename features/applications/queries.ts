const applicationKeys = {
  applications: ["applications"],
  applicationsFiltered: (filters: {}) => [
    ...applicationKeys.applications,
    filters,
  ],
  application: (id: number) => [...applicationKeys.applications, id],
};

export default applicationKeys;
