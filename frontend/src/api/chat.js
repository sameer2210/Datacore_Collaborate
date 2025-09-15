import axios from '../instant/backAxios';

export const getChatMessages = async () => {
  try {
    const response = await axios.get('/chat/messages');
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post('/chat/send', { message });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const markMessageAsRead = async (messageId) => {
  try {
    const response = await axios.put(`/chat/read/${messageId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Alias for compatibility
export const getAllChatMessages = getChatMessages;
