import React, { useState } from 'react';

import axios from 'axios';
import './MainChatbot.css';
import { useEffect, useRef} from 'react';
import { useAuth } from '../ContextProvider/AuthContext';
import { useTicket } from '../ContextProvider/TicketContext';
const MainChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [introSubmitted, setIntroSubmitted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [greetingClose, setGreetingClose] = useState(false);
  const [chatId, setTicketId] = useState(""); 
  const [chatStatus, setChatStatus] = useState('Ongoing');
  let currentTicketId = chatId || localStorage.getItem('chatbotTicketId');
  const [styles, setStyles] = useState({
    headerColor: '#4CAF50',
    backgroundColor: '#f1f1f1',
    userMessage: 'User',
    welcomeMessage: 'Welcome to our service!',
   
    introductionFormPlaceholderValues: {
      chatbotregisteredUsername: '',
      chatbotregisteredPhone: '',
      chatbotregisteredEmail: ''
    }
  });
 
  useEffect(() => {
    axios.get(`https://hubly-backend-ufnp.onrender.com/Chatbot/getchatbotstylesforuser`,{
      params:{
        AdminId: localStorage.getItem('userId') || 'Anonymous'
      }
    })
      .then(res => setStyles(
        {
          headerColor: res.data.data.headerColor,
          backgroundColor: res.data.data.backgroundColor,
          userMessage: res.data.data.userMessage,
          welcomeMessage: res.data.data.welcomeMessage,
        
          introductionFormPlaceholderValues: {
            chatbotregisteredUsername: res.data.data.introductionFormPlaceholderValues.chattingUserNamePlaceholderValue,
            chatbotregisteredPhone: res.data.data.introductionFormPlaceholderValues.chattingUserPhonePlaceholderValue,
            chatbotregisteredEmail: res.data.data.introductionFormPlaceholderValues.chattingUserEmailPlaceholderValue
          }
        }
      ))
      .catch(err => console.error("Failed to fetch styles", err));
  }, []);

  const [showFormType, setShowFormType] = useState(null);
  const [formData, setFormData] = useState({
    chatbotregisteredUsername: '',
     chatbotregisteredPhone: '',
    chatbotregisteredEmail: ''
  });

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };
  const refreshingRef = useRef(null); 

  const { loginChatbotUser } = useAuth();
  const { chatbotuserLoggedIn } = useAuth();


  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (showFormType === 'register') {
      const response=  await axios.post('https://hubly-backend-ufnp.onrender.com/Chatbot/registeranewuserthroughchatbot', formData);
        if (response.status === 200) {
          console.log('Chatbot User registered successfully:', response.data);
          alert('Chatbot User registered successfully');
        }
        
      } else if (showFormType === 'login') {
        const response= await axios.post('https://hubly-backend-ufnp.onrender.com/Chatbot/loginchatbotuser', {
          Email:formData.chatbotregisteredEmail,
          FullName:formData.chatbotregisteredUsername
        });
        if (response.status === 200) {
          console.log('Chatbot User logged in successfully:', response.data);
          localStorage.setItem('chatbotuserId', response.data.data._id);
         loginChatbotUser();
         console.log("Set chatbotuserLoggedIn true");
          alert('Chatbot User logged in successfully');
          
        }
        

        
      }

      setIntroSubmitted(true);
      console.log(styles.userMessage?.[0] );
      setMessages([{ sender: 'bot', text: styles.userMessage?.[0] || "Hi! How can I help you?" }]);
    } catch (error) {
      console.error('Form submission failed', error);
      setIntroSubmitted(true);
    
      setMessages([{ sender: 'bot', text: styles.userMessage?.[0] || "Hi! How can I help you?" }]);
    }
  };
  console.log("Is chatbot user logged in? ", chatbotuserLoggedIn);

  const fetchInitialMessages = async () => {
    try {
      if (!currentTicketId) {
        return;
      }
      console.log('Fetching initial messages for ticket ID:', currentTicketId);
      const response = await axios.get(`https://hubly-backend-ufnp.onrender.com/Chat/getAllChatsForChatbotUser/${currentTicketId}`);
      console.log('Initial messages response:', response.data);
      const formattedMessages = (response?.data?.chats?.Messages || [])
      .filter(msg => msg._id&& ((msg.senderRoleRef === "User"|| msg.senderRoleRef === "TeamMember"))|| msg.senderRoleRef === "ChatbotUser") 
        .map(msg => ({
          id: msg._id,
          sender: msg.senderRoleRef === "ChatbotUser" ? 'user' : 'bot',
          text: msg.text,
          timestamp: msg.timestamp
        }));

      setMessages(formattedMessages); 
    } catch (err) {
      console.error("Failed to fetch initial messages", err);
    }
  };

useEffect(() => {
  if (chatbotuserLoggedIn === true) {
    fetchInitialMessages();
  }
  console.log('Current Ticket ID:', currentTicketId);
}, [currentTicketId, chatbotuserLoggedIn]); 

  const handleSendMessage = async () => {
    if (chatStatus === 'Ended') {
      alert('This ticket is marked as resolved. Please raise a new ticket to chat.');
      return;
    }
    if (!input.trim()) return;
    console.log('Sending message:', input);
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
  
    try {
      console.log('Sending message to server:', input);
       console.log('Current Ticket ID:', currentTicketId);
      if (!currentTicketId) {
        const response = await axios.post('https://hubly-backend-ufnp.onrender.com/Chatbot/createanewchatwithuser', {
          ticketDescription: input,
          ticketPostedTime: new Date().toISOString(),
          ticketCreatedByUser: localStorage.getItem('chatbotuserId') || 'Anonymous'
        });
      
        const newTicketId = response?.data?.data?._id;
        console.log('New Ticket ID:', newTicketId);
        if (!newTicketId) throw new Error('Failed to create a new ticket.');
  
        setTicketId(newTicketId);
        localStorage.setItem('chatbotTicketId', newTicketId);
        currentTicketId = newTicketId;
        startPolling(newTicketId);
    
       
       
      }
      else{
        startPolling(currentTicketId);
        console.log('inside ticket id', currentTicketId);
     console.log('chatbotuserId', localStorage.getItem('chatbotuserId'));
    const response=  await axios.post(`https://hubly-backend-ufnp.onrender.com/Chatbot/sendmessagetochat/${currentTicketId}`, {
        userId: localStorage.getItem('chatbotuserId') || 'Anonymous',
        chatId: currentTicketId,
        chatMessage: input,
        replyUserId: localStorage.getItem('userId') || 'Anonymous'
      });
      console.log('Message sent successfully:', response.data);
      console.log(currentTicketId)
      
      }
     
  
    } catch (error) {
      console.error('Chatbot message sending failed:', error);
      alert('Failed to send message. Please try again.');
    }
  };
  
  
  
 
  const startPolling = (currentTicketId) => {
    if (refreshingRef.current) {
      clearInterval(refreshingRef.current);
      console.log("Cleared previous polling interval");
    }
  
    refreshingRef.current = setInterval(async () => {
      try {
        const response = await axios.get(`https://hubly-backend-ufnp.onrender.com/Chat/getAllChatsForChatbotUser/${currentTicketId}`);
        if (response.status !== 200) return;
  
        const chatStatusFromServer = response?.data?.chats?.ChatStatus || 'Ongoing';
        setChatStatus(chatStatusFromServer);
  
        const formattedMessages = (response?.data?.chats?.Messages || [])
        .filter(msg => msg._id&& (msg.senderRoleRef === "User"|| msg.senderRoleRef === "TeamMember")) 
        .map(msg => ({
          id: msg._id,
          sender: msg.senderRoleRef === "ChatbotUser" ? 'user' : 'bot',
          text: msg.text,
          timestamp: msg.timestamp
        }));
      
  
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewMessages = formattedMessages.filter(msg => !existingIds.has(msg.id));

          return [...prev, ...uniqueNewMessages];        });
  
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 10000); 
  };
  // const startPollingForNewTicket = (currentTicketId) => {
  //   if (!currentTicketId) {
  //     console.error('No current ticket ID available for polling.');
  //     return;
  //   }
  //   if (refreshingRef.current) {
  //     clearInterval(refreshingRef.current);
  //     console.log("Cleared previous polling interval");
  //   }
  //   refreshingRef.current = setInterval(async () => {
  //     try {
  //       const response = await axios.get(`https://hubly-backend-ufnp.onrender.com/Chat/getAllChatsForChatbotUser/${currentTicketId}`);
  //       if (response.status !== 200) return;
  //       const chatStatusFromServer = response?.data?.chats?.ChatStatus || 'Ongoing';
  //       setChatStatus(chatStatusFromServer);
        
  //       const formattedMessages = (response?.data?.chats?.Messages || [])
       
  //       .filter(msg => msg._id&& (msg.senderRoleRef === "User"|| msg.senderRoleRef === "TeamMember"))
  //       .map(msg => ({
  //         id: msg._id,
  //         sender: msg.senderRoleRef === "ChatbotUser" ? 'user' : 'bot',
  //         text: msg.text,
  //         timestamp: msg.timestamp
  //       }));
  //       console.log("Formatted Messages for new ticket",formattedMessages)
  //       setMessages(prev => {
  //         const existingIds = new Set(prev.map(m => m.id));
  //         const uniqueNewMessages = formattedMessages.filter(msg => !existingIds.has(msg.id));
  //         return [...prev, ...uniqueNewMessages];
  //       });
  //     } catch (error) {
  //       console.error('Polling error:', error);
  //     }
  //   }, 10000);
  // };
  
  
  useEffect(() => {
  
    if (chatId) {
      console.log("Starting polling for chatId", chatId);
      startPolling(chatId);
    }
   
   
    return () => {
      if (refreshingRef.current) {
        clearInterval(refreshingRef.current);
        refreshingRef.current = null;
        console.log("Stopped polling");
      }
    };
    
  }, [chatId]); 


  return (
    <div className="chatbot-container1">
      {!isOpen && !greetingClose && (
        <div className="chatbot-greeting">
          <div className="chatbot-icon-parent">
            <img src="/Chatbot.png" alt="Chatbot" className="chatbot-icon" width={'60px'} height={'60px'} />
          </div>
          <div className="chatbot-text">
            👋 Want to chat about Hubly? I'm a chatbot here to help you find your way.
          </div>
          <button className='chatbot-greeting-close' onClick={() => setGreetingClose(true)}>X</button>
        </div>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header" style={{ backgroundColor: styles.headerColor }}>
            <div className="header-left">
              <img src="/Chatbot.png" alt="Chatbot" className="chatbot-icon-small" />
              <span>Hubly</span>
            </div>
            <button className="close-button" onClick={handleToggleChat}>×</button>
          </div>

          <div className="chatbot-body" style={{ backgroundColor: styles.backgroundColor }}>
            {!introSubmitted ? (
              <>
                {!showFormType ? (
                  <div className="chatbot-form-selection">
                    <h4>Welcome! Are you new or existing user?</h4>
                    <button onClick={() => setShowFormType('register')} className="form-type-button">Register</button>
                    <button onClick={() => setShowFormType('login')} className="form-type-button">Login</button>
                  </div>
                ) : (
                  <form className="chatbot-form" onSubmit={handleFormSubmit}>
                    <h4>{showFormType === 'register' ? 'Register Yourself' : 'Login to Continue'}</h4>

                    {showFormType === 'register' && (
                       <input
                      type="text"
                      name="chatbotregisteredPhone"
                      placeholder={styles.introductionFormPlaceholderValues.chatbotregisteredPhone || '+1 (000) 000-0000'}
                      value={formData.chatbotregisteredPhone}
                      onChange={handleFormChange}
                      required
                    />
                     
                    )}
                    
                     <input
                        type="text"
                        name="chatbotregisteredUsername"
                        placeholder={styles.introductionFormPlaceholderValues.chatbotregisteredUsername || 'Your name'}
                        value={formData.chatbotregisteredUsername}
                        onChange={handleFormChange}
                        required
                      />
                    <input
                      type="email"
                      name="chatbotregisteredEmail"
                      placeholder={styles.introductionFormPlaceholderValues.chatbotregisteredEmail || 'example@gmail.com'}
                      value={formData.chatbotregisteredEmail}
                      onChange={handleFormChange}
                      required
                    />
                    <button type="submit" className="submit-button">
                      {showFormType === 'register' ? 'Register' : 'Login'}
                    </button>

                    <div className="switch-form">
                      {showFormType === 'register' ? (
                        <p>Already have an account? <span onClick={() => setShowFormType('login')}>Login</span></p>
                      ) : (
                        <p>New here? <span onClick={() => setShowFormType('register')}>Register</span></p>
                      )}
                    </div>
                  </form>
                )}
              </>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                  key={msg.id}

                    className={`chatbot-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                  >
                    {msg.sender === 'user' ? null : (
                      <img src="/Chatbot.png" alt="Chatbot" className="chatbot-icon-small" />
                    )}
                    {msg.text}
                  </div>
                ))}
              </>
            )}
          </div>

          {introSubmitted && (
  <div className="chatbot-footer">
    {chatStatus === 'Ended' ? (
      <div className="chatbot-ended-message">
        Ticket is resolved. Please start a new chat to continue.
        <button
  className="new-ticket-button"
  onClick={() => {
    if (refreshingRef.current) {
      clearInterval(refreshingRef.current);
      refreshingRef.current = null;
      console.log("Stopped polling for new ticket");
    }
    setTicketId('');
    localStorage.removeItem('chatbotTicketId');
    setMessages([{ sender: 'bot', text: 'Hi! How can I help you?' }]);
    setChatStatus('Ongoing');
    currentTicketId = '';
  }}
>
  Start New Ticket
</button>

      </div>
    ) : (
      <>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Write a message"
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="send-button" onClick={handleSendMessage}>
          <img src="/SendIcon.png" alt="Send" className="send-icon" />
        </button>
      </>
    )}
  </div>
)}

        </div>
      )}

      <button className="chatbot-toggle-button" onClick={handleToggleChat}>
      

        {!isOpen ? <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_13_96)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M30.7157 3.48895C30.4611 1.91354 29.5109 0.964894 27.9801 0.748407C27.9428 0.739488 24.2147 0.024353 18.3638 0.024353C12.5147 0.024353 8.78654 0.739488 8.76141 0.745164C7.56384 0.915434 6.72871 1.52922 6.29492 2.52246C8.80206 2.2453 11.3228 2.10914 13.8452 2.11462C19.516 2.11462 23.2887 2.76652 23.8425 2.86868C26.339 3.24327 28.0749 4.97516 28.4949 7.513C28.6765 8.34003 29.2506 11.2476 29.2506 14.7187C29.2506 16.5771 29.0836 18.2822 28.9036 19.5852C29.8928 19.1668 30.5155 18.3284 30.7117 17.1171C30.7182 17.0871 31.4357 14.0246 31.4357 10.2941C31.4357 6.56435 30.7182 3.50192 30.7141 3.48814" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M26.1976 7.91355C25.943 6.33734 24.9919 5.38869 23.4619 5.17139C23.4246 5.16328 19.6965 4.44977 13.8465 4.44977C7.99728 4.44977 4.26836 5.16328 4.24404 5.16977C2.70107 5.38869 1.7508 6.33734 1.50026 7.89652C1.49215 7.92652 0.775391 10.989 0.775391 14.7195C0.775391 18.4492 1.49215 21.5117 1.4962 21.5246C1.7508 23.1008 2.70107 24.0495 4.23188 24.2668C4.26188 24.2725 6.68053 24.7354 10.664 24.9163L13.0381 29.0287C13.12 29.1706 13.2378 29.2885 13.3797 29.3705C13.5216 29.4524 13.6826 29.4956 13.8465 29.4956C14.0103 29.4956 14.1713 29.4524 14.3132 29.3705C14.4551 29.2885 14.573 29.1706 14.6549 29.0287L17.0297 24.9171C21.0132 24.7354 23.4294 24.2733 23.4497 24.2684C24.9919 24.0495 25.943 23.1008 26.1935 21.5417C26.2016 21.5117 26.9176 18.4492 26.9176 14.7195C26.9176 10.989 26.2008 7.92652 26.1976 7.91355Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_13_96">
<rect width="32" height="30" fill="white"/>
</clipPath>
</defs>
</svg> : <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_13_118)">
<path d="M20 1.17833L18.8217 0L10 8.82167L1.17833 0L0 1.17833L8.82167 10L0 18.8217L1.17833 20L10 11.1783L18.8217 20L20 18.8217L11.1783 10L20 1.17833Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_13_118">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>
}
      </button>
    </div>
  );
};

export default MainChatbot;
