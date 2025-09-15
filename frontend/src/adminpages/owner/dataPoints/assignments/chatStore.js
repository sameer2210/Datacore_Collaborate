// // Simple store without zustand dependency
// const chatState = {
//   messages: [],
//   unreadCount: 0
// };

// const useChatStore = () => ({
//   messages: chatState.messages,
//   unreadCount: chatState.unreadCount,

//   addMessage: (message) => {
//     chatState.messages.push({ ...message, id: Date.now(), timestamp: new Date() });
//     chatState.unreadCount += 1;
//   },

//   markAllAsRead: () => {
//     chatState.unreadCount = 0;
//   },

//   clearMessages: () => {
//     chatState.messages = [];
//     chatState.unreadCount = 0;
//   },

//   getMessages: () => chatState.messages,
//   getUnreadCount: () => chatState.unreadCount
// });

// // Export both for compatibility
// const useTaggingStore = useChatStore;

// export default useChatStore;
// export { useTaggingStore };

//----------------------------------------------------------------------------------------------

// Simple store without zustand dependency
import { getAllChatMessages } from '../../../../api/chat';
import { getAllReports } from '../../../../api/reportApis';
import { getAllUsers } from '../../../../api/userApis';

const chatState = {
  messages: [],
  unreadCount: 0,
  allUsers: [],
  allReports: [], // Added: For dashboard/ReportCard
};

const useChatStore = () => ({
  messages: chatState.messages,
  unreadCount: chatState.unreadCount,
  allUsers: chatState.allUsers,
  allReports: chatState.allReports, // Expose reports

  addMessage: message => {
    chatState.messages.push({ ...message, id: Date.now(), timestamp: new Date() });
    chatState.unreadCount += 1;
  },

  markAllAsRead: () => {
    chatState.unreadCount = 0;
  },

  clearMessages: () => {
    chatState.messages = [];
    chatState.unreadCount = 0;
  },

  getMessages: () => chatState.messages,
  getUnreadCount: () => chatState.unreadCount,

  // Real fetchUsers using your API
  fetchUsers: async () => {
    try {
      const response = await getAllUsers();
      if (!response.error) {
        chatState.allUsers = response.data || [];
        console.log('Users fetched:', chatState.allUsers.length); // Debug
      } else {
        console.error('Fetch users error:', response.error);
        chatState.allUsers = []; // Fallback
      }
    } catch (error) {
      console.error('Fetch users failed:', error);
      chatState.allUsers = [];
    }
  },

  // Added: Fetch reports (for ReportCard/dashboard)
  fetchReports: async () => {
    try {
      const response = await getAllReports();
      if (!response.error) {
        chatState.allReports = response.data || [];
        console.log('Reports fetched:', chatState.allReports.length); // Debug
      } else {
        console.error('Fetch reports error:', response.error);
        chatState.allReports = [];
      }
    } catch (error) {
      console.error('Fetch reports failed:', error);
      chatState.allReports = [];
    }
  },

  // Added: Fetch messages (for ChatTray)
  fetchMessages: async () => {
    try {
      const response = await getAllChatMessages();
      if (!response.error) {
        chatState.messages = response.data || [];
        console.log('Messages fetched:', chatState.messages.length); // Debug
      } else {
        console.error('Fetch messages error:', response.error);
        chatState.messages = [];
      }
    } catch (error) {
      console.error('Fetch messages failed:', error);
      chatState.messages = [];
    }
  },
});

// Export both for compatibility
const useTaggingStore = useChatStore;

export default useChatStore;
export { useTaggingStore };
