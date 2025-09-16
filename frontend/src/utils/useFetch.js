import { useEffect, useState } from 'react';
import api from '../instant/backAxios';

// Helper function to build query strings
const buildQueryString = (baseUrl, params) => {
  const query = new URLSearchParams();

  // Add parameters to the query string
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      query.append(key, value.join(',')); // Handle array values
    } else if (value !== undefined && value !== null && value !== '') {
      query.append(key, value); // Handle non-empty values
    }
  });

  // Check if there are any query parameters
  const queryString = query.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

const useFetch = (baseUrl, queryParams = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const urlWithQuery = buildQueryString(baseUrl, queryParams);
      const res = await api.get(urlWithQuery);
      setData(res.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [baseUrl, JSON.stringify(queryParams)]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
