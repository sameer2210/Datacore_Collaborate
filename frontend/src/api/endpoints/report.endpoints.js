import constant from '../../constant';

const REPORT_ENDPOINTS = {
  GET_ALL_REPORTS: `${constant.API_URL}/admin/all-user`,
  GET_REPORT_BY_ID: id => `${constant.API_URL}/reports/${id}`,
  CREATE_REPORT: `${constant.API_URL}/reports`,
  UPDATE_REPORT: id => `${constant.API_URL}/reports/${id}`,
  DELETE_REPORT: id => `${constant.API_URL}/reports/${id}`,
  GET_PENDING_REPORTS: `${constant.API_URL}/reports/pending`,
  APPROVE_REPORT: id => `${constant.API_URL}/reports/${id}/approve`,
  REJECT_REPORT: id => `${constant.API_URL}/reports/${id}/reject`,
};

export default REPORT_ENDPOINTS;
export const reportEndpoints = REPORT_ENDPOINTS;
