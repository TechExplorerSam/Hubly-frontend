import React from 'react';

const ChatList = ({ chats = [], onSelectChat, selectedChatId, ticketId }) => {
  return (
    <div className="chat-list">
      <h2 className="chat-list-title">Chats</h2>
      
      {Array.isArray(chats) && chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat._id}
            className={`chat-list-item ${selectedChatId === chat._id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat)}
          >
            <div className="avatar"></div>
            <div>
              <p className="chat-name">{chat.SenderUser}</p> 
              <p className="chat-msg">{chat.Messages[0]?.text}</p> 
              <p className="ticket-id">Ticket ID: {(ticketId||localStorage.getItem('ticketId'))} </p>
            </div>
          </div>
        ))
      ) : (
        <div>No chats available</div> 
      )}
    </div>
  );
};

export default ChatList;
