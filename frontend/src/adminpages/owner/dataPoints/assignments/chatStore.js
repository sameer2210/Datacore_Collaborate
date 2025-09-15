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




// Simple store without zustand dependency
const chatState = {
  messages: [],
  unreadCount: 0,
  allUsers: []   // <-- add this
};

const useChatStore = () => ({
  messages: chatState.messages,
  unreadCount: chatState.unreadCount,
  allUsers: chatState.allUsers,   // <-- expose it

  addMessage: (message) => {
    chatState.messages.push({ ...message, id: Date.now(), timestamp: new Date() });
    chatState.unreadCount += 1;
  },

  markAllAsRead: () => {
    chatState.unreadCount = 0;
  },

  clearMessages: () => {
    chatState.messages = [];
    chatState.unreadCount = 0;
    chatState.allUsers = [];
  },

  getMessages: () => chatState.messages,
  getUnreadCount: () => chatState.unreadCount,

  // ✅ add fake fetchUsers
  fetchUsers: () => {
    chatState.allUsers = [
      { id: 1, name: "Sameer Khan", profileImage: "" },
      { id: 2, name: "Admin User", profileImage: "" }
    ];
    return chatState.allUsers;
  }
});

// Export both for compatibility
const useTaggingStore = useChatStore;

export default useChatStore;
export { useTaggingStore };
