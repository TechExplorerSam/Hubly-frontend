import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components(Reusable)/Sidebar';
 import './Chatbot.css';

const Chatbot = () => {
  const [chatbotConfig, setChatbotConfig] = useState({
    HeaderColor: '#33475B',
    BackgroundColor: '#EEEEEE',
    UserMessage: ["How can I help you?", "Ask me anything!"],
    WelcomeMessage: "👋 Want to chat about Hubly? I'm a chatbot here to help you find your way.",
    MissedChatTimer: { hours: '00', minutes: '00', seconds: '00' },
    introductionFormPlaceholderValues: { 
      chattingUserNamePlaceholderValue: 'Enter your name', 
      chattingUserPhonePlaceholderValue: 'Enter your phone number', 
      chattingUserEmailPlaceholderValue: 'Enter your email' 
    },
  });

  const creatingAdminId = localStorage.getItem('userId');

  const [isLoading, setIsLoading] = useState(true);
  const [headingColor, setHeadingColor] = useState('white');

  useEffect(() => {
    console.log("useEffect triggered, adminId:", creatingAdminId); 
    if (!creatingAdminId) {
      console.log("No adminId, skipping fetch"); 
      return;
    }
  
    const fetchConfig = async () => {
      try {
        console.log("Starting API call..."); 
        const response = await axios.get('https://hubly-backend-ufnp.onrender.com//Chatbot/getchatbotstylesforuser', {
          params: {AdminId: creatingAdminId }
        });
        
        console.log("API Response:", response); 
  
        if (response.data && response.data.data) {
          const fetchedConfig = response.data.data;  
          console.log("Fetched Config:", fetchedConfig);
          
          const mappedConfig = {
            HeaderColor: fetchedConfig.headerColor || '#33475B',
            BackgroundColor: fetchedConfig.backgroundColor || '#EEEEEE',
            UserMessage: fetchedConfig.userMessage || ["How can I help you?", "Ask me anything!"],
            WelcomeMessage: fetchedConfig.welcomeMessage || "👋 Want to chat about Hubly? I'm a chatbot here to help you find your way.",
            MissedChatTimer: fetchedConfig.missedChatTimer || { hours: '00', minutes: '00', seconds: '00' },
            introductionFormPlaceholderValues: {
              chattingUserNamePlaceholderValue: fetchedConfig.introductionFormPlaceholderValues?.chattingUserNamePlaceholderValue ,
              chattingUserPhonePlaceholderValue: fetchedConfig.introductionFormPlaceholderValues?.chattingUserPhonePlaceholderValue ?? 'Enter your phone number',
              chattingUserEmailPlaceholderValue: fetchedConfig.introductionFormPlaceholderValues?.chattingUserEmailPlaceholderValue ??'Enter your email'
            }
          };
  
          console.log("Mapped Config:", mappedConfig); 
          setChatbotConfig(mappedConfig);
          setHeadingColor(mappedConfig.HeaderColor.toLowerCase() === '#ffffff' ? 'black' : 'white');
        }
      } catch (error) {
        console.error("API Error:", error); 
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchConfig();
  }, [creatingAdminId]);
  
  
  const handleInputChange = (section, field, value) => {
    if (section === 'HeaderColor' || section === 'BackgroundColor') {
      setChatbotConfig(prev => ({
        ...prev,
        [section]: value
      }));
  
      if (section === 'HeaderColor') {
        setHeadingColor(value.toLowerCase() === '#ffffff' ? 'black' : 'white');
      }
    } else {
      setChatbotConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };
  

  const handleMessageChange = (index, value) => {
    const updatedMessages = [...chatbotConfig.UserMessage];
    updatedMessages[index] = value;
    setChatbotConfig(prev => ({
      ...prev,
      UserMessage: updatedMessages
    }));
  };

  const handleSaveAll = () => {
    console.log("Sending config to backend:", {
      ...chatbotConfig,
      creatingAdminId: creatingAdminId
    });
    axios.post('https://hubly-backend-ufnp.onrender.com//Chatbot/customizechatbotstyles', {
      ...chatbotConfig,
      creatingAdminId: creatingAdminId
    })
    .then(response => {
      console.log("Chatbot config saved successfully:", response.data);
      alert("Chatbot config saved successfully!");
    })
    .catch(error => {
      console.error("Error saving chatbot config:", error);
      alert("Error saving chatbot config. Please try again.");
    });
  };

  if (isLoading) return <div>Loading chatbot settings...</div>;

  return (
    <div className="chatbot-wrapper">
      <Sidebar />
      <div className="chatbot-container">
        <div className="chatbot-card" style={{ backgroundColor: chatbotConfig.BackgroundColor }}>
          <div className="chatbot-header" style={{ backgroundColor: chatbotConfig.HeaderColor }}>
            <img src="./Chatbot.png" alt="logo" className="chatbot-logo" />
            <h3 style={{ color: headingColor }}>Hubly</h3>
          </div>

          <div className="chatbot-messages">
            {chatbotConfig.UserMessage.map((msg, idx) => (
              <p key={idx} className="chatbot-message">{msg}</p>
            ))}
          </div>

          <div className="chatbot-introduction-form">
            <h4>Introduce Yourself</h4>
            <input 
              type="text" 
              name="userName" 
              placeholder={chatbotConfig.introductionFormPlaceholderValues.chattingUserNamePlaceholderValue} 
            />
            <input 
              type="text" 
              name="userPhone" 
              placeholder={chatbotConfig.introductionFormPlaceholderValues.chattingUserPhonePlaceholderValue}
            />
            <input 
              type="email" 
              name="userEmail" 
              placeholder={chatbotConfig.introductionFormPlaceholderValues.chattingUserEmailPlaceholderValue}
            />
            <button className="thankyou-button">Thank You!</button>
          </div>

          <div className="chatbot-input-section">
            <input type="text" placeholder="Write a message..." />
            <button className="send-button">
              <img src="./SendIcon.png" alt="send" />
            </button>
          </div>
        </div>

        <div className="mini-chat-widget">
          <img src="./Chatbot.png" alt="mini-logo" />
          <p>{chatbotConfig.WelcomeMessage}</p>
        </div>

        <div className="chatbot-settings-panel">
          <div className="settings-card">
            <h3 className="section-title">Header Color</h3>
            <div className="palette-row">
              {['#ffffff', '#000000', '#33475B'].map(color => (
                <div 
                  key={color} 
                  className="circle-palette" 
                  style={{ backgroundColor: color }}
                  onClick={() => handleInputChange('HeaderColor', 'HeaderColor', color)}
                />
              ))}
            </div>
            <div className="input-row">
              <div className="square-preview" style={{ backgroundColor: chatbotConfig.HeaderColor }}></div>
              <input 
                type="text" 
                value={chatbotConfig.HeaderColor}
                onChange={(e) => handleInputChange('HeaderColor', 'HeaderColor', e.target.value)}
                className="color-input"
              />
            </div>
          </div>

          <div className="settings-card">
            <h3 className="section-title">Background Color</h3>
            <div className="palette-row">
              {['#ffffff', '#000000', '#EEEEEE'].map(color => (
                <div 
                  key={color}
                  className="circle-palette"
                  style={{ backgroundColor: color }}
                  onClick={() => handleInputChange('BackgroundColor', 'BackgroundColor', color)}
                />
              ))}
            </div>
            
            <div className="input-row">
              <div className="square-preview" style={{ backgroundColor: chatbotConfig.BackgroundColor }}></div>
              <input 
                type="text" 
                value={chatbotConfig.BackgroundColor}
                onChange={(e) => handleInputChange('BackgroundColor', 'BackgroundColor', e.target.value)}
                className="color-input"
              />
            </div>
          </div>
          <div className="settings-card">
  <h3 className="section-title">Introduction Form Placeholders</h3>
  <div className="form-placeholder-group">
    <label>Name Placeholder</label>
    <input
      type="text"
      value={chatbotConfig.introductionFormPlaceholderValues.chattingUserNamePlaceholderValue}
      onChange={(e) =>
        handleInputChange('introductionFormPlaceholderValues', 'chattingUserNamePlaceholderValue', e.target.value)
      }
      className="message-input"
    />
    
    <label>Phone Placeholder</label>
    <input
      type="text"
      value={chatbotConfig.introductionFormPlaceholderValues.chattingUserPhonePlaceholderValue}
      onChange={(e) =>
        handleInputChange('introductionFormPlaceholderValues', 'chattingUserPhonePlaceholderValue', e.target.value)
      }
      className="message-input"
    />

    <label>Email Placeholder</label>
    <input
      type="text"
      value={chatbotConfig.introductionFormPlaceholderValues.chattingUserEmailPlaceholderValue}
      onChange={(e) =>
        handleInputChange('introductionFormPlaceholderValues', 'chattingUserEmailPlaceholderValue', e.target.value)
      }
      className="message-input"
    />
  </div>
</div>

        

          <div className="settings-card">
            <h3 className="section-title">Customize Message</h3>
            <div className="message-list">
              {chatbotConfig.UserMessage.map((msg, idx) => (
                <div key={idx} className="message-item">
                  <input 
                    type="text" 
                    value={msg} 
                    onChange={(e) => handleMessageChange(idx, e.target.value)} 
                    className="message-input" 
                  />
                  <span className="edit-icon">
                    <img src="./ChatbotSettingsEdit.png" alt="edit" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-card">
            <h3>Missed Chat Timer</h3>
            <div className="missed-chat-timer">
              {['hours', 'minutes', 'seconds'].map((field) => (
                <React.Fragment key={field}>
                  <select
                    className="timer-select"
                    value={chatbotConfig.MissedChatTimer[field]}
                    onChange={(e) => handleInputChange('MissedChatTimer', field, e.target.value)}
                  >
                    {Array.from({ length: field === 'hours' ? 24 : 60 }).map((_, idx) => (
                      <option key={idx} value={idx.toString().padStart(2, '0')}>
                        {idx.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  {field !== 'seconds' && <span>:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button className="save-btn" onClick={handleSaveAll}>
              Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
