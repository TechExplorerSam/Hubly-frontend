import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTicket } from '../ContextProvider/TicketContext';
const ChatWindow = ({ chat, ticketId, setChat }) => {
   const [assignedToAnotherUser, setAssignedToAnotherUser] = useState(false);
   const [isMissedChat, setIsMissedChat] = useState(false);
   const [isChatResolved, setIsChatResolved] = useState(false);
   const [isTeammate, setIsTeammate] = useState(false);
   const [replyText, setReplyText] = useState('');
   const navigate = useNavigate();
const {ticketName}=useTicket();
   function formatDateWithSuffix(date) {
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();

      const getDaySuffix = (d) => {
         if (d > 3 && d < 21) return 'th';
         switch (d % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
         }
      };

      return `${day}${getDaySuffix(day)} ${month}, ${year}`;
   }
     
   const handleReplySubmit = async () => {
      if (!replyText.trim()) return;

      const newMessage = {
         SenderUserRole: 'User',
         text: replyText,
         SenderUserId: localStorage.getItem('userId'),
         timestamp: new Date().toISOString(),
      };
     
      console.log(localStorage.getItem('userId'));
   
      setChat(prevChats => {
         return prevChats.map(prevChat => {
            if (prevChat._id === chat._id) {
              
               return {
                  ...prevChat,
                  Messages: [...(prevChat.Messages || []), newMessage],
               };
            }
            return prevChat;
         });
      });

      setReplyText('');

      try {
         await axios.post('https://hubly-backend-ufnp.onrender.com/Chatbot/sendreplytochatbotuser', {
            chatId: chat._id,
            replyMessage: replyText,
            replyUserRole: 'User',
            replyUserId: localStorage.getItem('userId'),
         });
      } catch (error) {
         console.error('Error sending message:', error);
      }
   };
    localStorage.setItem('chatSenderId',chat.SenderUser)
   const messages = chat?.Messages || [];
   const classifyChatAsMissedChat = () => {
    const userId = localStorage.getItem('userId');
    const ticketId = localStorage.getItem('ticketId');

    axios.post('https://hubly-backend-ufnp.onrender.com/Chat/classifychatasmissedchat', {
       userId,
       ticketId,
    })
       .then((response) => {
          console.log('Chat classified as missed:', response.data);
          setIsMissedChat(true);
       })
       .catch((error) => {
          console.error('Error classifying chat as missed:', error);
       });
 };

 const checkIfChatIsMissed = () => {
    const latestMessage = chat.Messages[chat.Messages.length - 1];
    const lastReplyTime = new Date(latestMessage.timestamp).getTime();
    const currentTime = new Date().getTime();

    if (currentTime - lastReplyTime >= 60 * 60 * 1000 && chat.missed === false) {
       classifyChatAsMissedChat();
    }
 };


 useEffect(() => {
    if (chat && chat.Messages && chat.Messages.length > 0) {
       checkIfChatIsMissed();
    }

    if (chat.ChatStatus === 'Ended') {
       setIsChatResolved(true);
    }
 }, [chat]);

 const checkIfChatAssignedToAnotherUser = async () => {
   const userFromStorage = localStorage.getItem('user');
   const userId = localStorage.getItem('userId');
   const ticketId = localStorage.getItem('ticketId');
 
   if (!userFromStorage || !userId || !ticketId) {
     console.warn('Missing user or ticket information');
     return;
   }
 
   const user = JSON.parse(userFromStorage);
   const isTeamMember = user?.isTeamMember;
 
   console.log('User is Team Member:', isTeamMember);
 
   if (isTeamMember) {
     setAssignedToAnotherUser(false);
     setIsTeammate(true);
     return;
   }
 
   try {
     const response = await axios.get(`https://hubly-backend-ufnp.onrender.com/Chat/checkifchatassignedtoanotheruser`, {
       params: {
         userId,
         ticketId,
       },
       headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`,
       },
     });
 
     const { assignedToAnotherUser = false, assignedUser = null, chats = [] } = response.data || {};
     const assignedToUserId = assignedUser?._id;
 
     console.log('Response:', response.data);
     console.log('Chat assigned to another user:', assignedToAnotherUser);
     console.log('Assigned to user ID:', assignedToUserId);
 
     setAssignedToAnotherUser(assignedToAnotherUser && assignedUser?._id !== userId);
 
   } catch (error) {
     console.error('Error checking assignment:', error);
   }
 };
 
 useEffect(() => {
   checkIfChatAssignedToAnotherUser();
 }, [chat]);  
 

   return (
      <div className="chat-window">
         <div className="chat-header">
            Ticket# {ticketName}
            <button className="button-dashboard" onClick={() => { navigate('/dashboard') }}>
               <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.99984 15.8333H8.0765V11.6025C8.0765 11.4119 8.14123 11.2522 8.27067 11.1233C8.39956 10.9939 8.55928 10.9292 8.74984 10.9292H11.2498C11.4404 10.9292 11.6004 10.9939 11.7298 11.1233C11.8587 11.2522 11.9232 11.4119 11.9232 11.6025V15.8333H14.9998V8.59C14.9998 8.50444 14.9812 8.42667 14.944 8.35667C14.9068 8.28667 14.8559 8.22555 14.7915 8.17333L10.3048 4.79167C10.2193 4.71722 10.1176 4.68 9.99984 4.68C9.88206 4.68 9.78067 4.71722 9.69567 4.79167L5.20817 8.17333C5.14428 8.22667 5.09345 8.28778 5.05567 8.35667C5.01789 8.42556 4.99928 8.50333 4.99984 8.59V15.8333ZM4.1665 15.8333V8.59C4.1665 8.37667 4.21428 8.17472 4.30984 7.98417C4.40539 7.79361 4.53706 7.63667 4.70484 7.51333L9.19234 4.115C9.42734 3.93556 9.69567 3.84583 9.99734 3.84583C10.299 3.84583 10.569 3.93556 10.8073 4.115L15.2948 7.5125C15.4632 7.63583 15.5948 7.79306 15.6898 7.98417C15.7854 8.17472 15.8332 8.37667 15.8332 8.59V15.8333C15.8332 16.0567 15.7501 16.2514 15.584 16.4175C15.4179 16.5836 15.2232 16.6667 14.9998 16.6667H11.7632C11.5721 16.6667 11.4121 16.6022 11.2832 16.4733C11.1543 16.3439 11.0898 16.1839 11.0898 15.9933V11.7633H8.90984V15.9933C8.90984 16.1844 8.84539 16.3444 8.7165 16.4733C8.58762 16.6022 8.42789 16.6667 8.23734 16.6667H4.99984C4.7765 16.6667 4.58178 16.5836 4.41567 16.4175C4.24956 16.2514 4.1665 16.0567 4.1665 15.8333Z" fill="#424242"/>
               </svg>
            </button>
         </div>
         <div className="chat-body">
    {messages.length === 0 ? (
        <p>No messages yet.</p>
    ) : (
        messages.map((msg, idx) => (
          
            <div key={idx} className={`message ${msg.senderRoleRef === 'ChatbotUser' ? 'left' : 'right'}`}>
                <img 
                    src={msg.senderRole === 'User' ? './logo.png' : './logo.png'} 
                    alt="avatar" 
                    className="avatar2" 
                />
                <strong>{msg.senderRoleRef === 'ChatbotUser' ?'User' : 'You'}:</strong> 
                {msg.text}
            </div>
            
        ))
        
    )}
</div>


         <div className="divider">
            <span className="divider-text">{formatDateWithSuffix(new Date())}</span>
         </div>

         {isMissedChat ? <p className='missed-chat'>Replying to missed chat</p> : null}

         {
          
         isChatResolved ? (
            <p className='chat-resolved'>This chat has been resolved</p>
         ) : (isTeammate|| assignedToAnotherUser) ? (
            <div className="chat-input">
               <input 
                  type="text" 
                  placeholder="Type here..." 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)} 
               />
               <button onClick={handleReplySubmit}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                     <path d="M1.5 10V7L5.5 6L1.5 5V2L11 6L1.5 10Z" fill="#D1D6DA"/>
                  </svg>
               </button>
            </div>
         ) : (
            <p className='assigned-to-another-user'>This ticket has been assigned to another user. You no longer have access</p>
         )}
      </div>
   );
};

export default ChatWindow;
