import React, { useEffect, useState, useRef } from "react";
import "./TeamChatTray.css";
import emptyuser from "../../assets/emptyuser.avif";
import { useNavigate } from "react-router-dom";
import { useTaggingStore } from "../owner/dataPoints/assignments/chatStore";
import { getAllChatMessages } from "../../api/chat";
import constant from "../../constant";

const ChatTray = ({ isOpen, onClose, anchorRef }) => {
  const navigate = useNavigate();
  const { allUsers, fetchUsers } = useTaggingStore();
  const [position, setPosition] = useState({ top: 70, right: 170 });
  const trayRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!allUsers || allUsers.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, allUsers]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getAllChatMessages();
        // console.log("response" ,response)
        if (response.success) {
          // console.log("response data", response.data.messages)
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    if (anchorRef?.current && isOpen) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen, anchorRef]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       trayRef.current &&
  //       !trayRef.current.contains(event.target) &&
  //       anchorRef?.current &&
  //       !anchorRef.current.contains(event.target)
  //     ) {
  //       onClose();
  //     }
  //   };

  //   if (isOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isOpen, onClose, anchorRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        trayRef.current &&
        !trayRef.current.contains(event.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    const handleScroll = (event) => {
      if (
        trayRef.current &&
        !trayRef.current.contains(event.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true); // true for capture phase
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, onClose, anchorRef]);

  const getUserDetails = (senderId) => {
    const user = allUsers?.find((user) => user.id === senderId);
    return {
      name: user?.name || "Unknown User",
      image: user?.profileImage
        ? `${constant.IMG_URL}/${user.profileImage}`
        : emptyuser,
    };
  };

  const handleViewReport = (reportId) => {
    onClose();
    navigate(`/add-data-points/${reportId}`);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={trayRef}
      className={`chat-tray ${isOpen ? "chat-tray-open" : ""}`}
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
    >
      <div className="chat-tray-header" style={{ borderRadius: "8px" }}>
        <h2>Mention</h2>
        <button onClick={onClose} className="close-button">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.281 18.2188C19.3507 18.2885 19.406 18.3712 19.4437 18.4623C19.4814 18.5533 19.5008 18.6509 19.5008 18.7494C19.5008 18.848 19.4814 18.9456 19.4437 19.0366C19.406 19.1277 19.3507 19.2104 19.281 19.2801C19.2114 19.3497 19.1286 19.405 19.0376 19.4427C18.9465 19.4804 18.849 19.4999 18.7504 19.4999C18.6519 19.4999 18.5543 19.4804 18.4632 19.4427C18.3722 19.405 18.2895 19.3497 18.2198 19.2801L12.0004 13.0598L5.78104 19.2801C5.64031 19.4208 5.44944 19.4999 5.25042 19.4999C5.05139 19.4999 4.86052 19.4208 4.71979 19.2801C4.57906 19.1393 4.5 18.9485 4.5 18.7494C4.5 18.5504 4.57906 18.3595 4.71979 18.2188L10.9401 11.9994L4.71979 5.78007C4.57906 5.63933 4.5 5.44846 4.5 5.24944C4.5 5.05042 4.57906 4.85955 4.71979 4.71882C4.86052 4.57808 5.05139 4.49902 5.25042 4.49902C5.44944 4.49902 5.64031 4.57808 5.78104 4.71882L12.0004 10.9391L18.2198 4.71882C18.3605 4.57808 18.5514 4.49902 18.7504 4.49902C18.9494 4.49902 19.1403 4.57808 19.281 4.71882C19.4218 4.85955 19.5008 5.05042 19.5008 5.24944C19.5008 5.44846 19.4218 5.63933 19.281 5.78007L13.0607 11.9994L19.281 18.2188Z"
              fill="black"
            />
          </svg>
        </button>
      </div>

      <div className="chat-tray-content">
        {messages.map((message) => {
          const userDetails = getUserDetails(message.sender);
          return (
            <div key={message.id} className="message-item">
              <div className="message-avatar">
                <img src={userDetails.image} alt="User avatar" />
              </div>
              <div className="message-content">
                <div className="message-header">
                  <h3>{userDetails.name}</h3>
                  <span className="message-time">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="message-context">
                  Mentioned you in {message.code} : {message.kpiName.join(", ")}
                </p>
                <p className="message-text">{message.message}</p>
                <button
                  onClick={() => handleViewReport(message.reportId)}
                  className="view-report"
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  View Report
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatTray;
