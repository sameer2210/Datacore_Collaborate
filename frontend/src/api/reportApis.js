import axios from '../instant/backAxios';

export const getAllReports = async () => {
  try {
    const response = await axios.get('/reports');
    return { data: response.data, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const getReportById = async (id) => {
  try {
    const response = await axios.get(`/reports/${id}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const createReport = async (reportData) => {
  try {
    const response = await axios.post('/reports', reportData);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateReport = async (id, reportData) => {
  try {
    const response = await axios.put(`/reports/${id}`, reportData);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const deleteReport = async (id) => {
  try {
    const response = await axios.delete(`/reports/${id}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getPendingReports = async () => {
  try {
    const response = await axios.get('/reports/pending');
    return { data: response.data, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};
