import axios from '../instant/backAxios';

export const getSubscriptionPlans = async () => {
  try {
    const response = await axios.get('/subscription/plans');
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const activePlan = async () => {
  try {
    const response = await axios.get('/subscription/active');
    return { data: response.data, error: null };
  } catch (error) {
    return { data: { plan_name: 'Basic' }, error: null }; // Default fallback
  }
};

export const subscribeToPlan = async (planId) => {
  try {
    const response = await axios.post('/subscription/subscribe', { planId });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const cancelSubscription = async () => {
  try {
    const response = await axios.post('/subscription/cancel');
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};
