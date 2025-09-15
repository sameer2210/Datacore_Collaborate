import axios from '../instant/backAxios';

export const getAllUsers = async () => {
  try {
    const response = await axios.get('/users');
    return { data: response.data, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`/users/${id}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`/users/${id}`, userData);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};
