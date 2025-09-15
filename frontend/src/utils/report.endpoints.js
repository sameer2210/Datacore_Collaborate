export const reportEndpoints = {
  initiateReport: "/report/initiate",
  getReport: (id) => `/report/${id}`,
  saveProgress: (id) => `/report/${id}`,
  generate: (id) => `/report/genrate/${id}`,
  uploadDocuments: (id) => `/report/ai/${id}?useOldFiles=true`,
  updateReportStatus: (id) => `/report/update-status/${id}`,
  getReports: `/report`,
  getLast6YearsReports: `/report/last-6-years`,
  assignUser: (id) => `/report/assign/${id}`,
};
