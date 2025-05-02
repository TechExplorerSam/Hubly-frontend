import React, { useState, useEffect } from 'react'
import Sidebar from '../Components(Reusable)/Sidebar'
import axios from 'axios'
import ChatWindow from './ChatsWindow'
import ChatList from './UserChatsList'
import ChatUserDetails from './ChatUserDetails'
import './ContactCenter.css'
import { useTicketContext } from '../ContextProvider/TicketContext'
const ContactCenter = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  let { ticketId } = useTicketContext();  
  
  console.log('Ticket ID:', ticketId);
  if (ticketId){
  localStorage.setItem('ticketId', ticketId);
  }
  useEffect(() => {
    fetchChats();
  }, [ticketId]);  

  const fetchChats = async () => {
    try {
      if (!ticketId) {
        ticketId = localStorage.getItem('ticketId');
        if (!ticketId) {
          console.error('No ticket ID found');
          return;
        }
      }
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:9001/Chat/getAllChatsForaTicket/${ticketId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      console.log('Response from fetchChats:', response.data);
      const fetchedChats = response.data.chats || [];  

      console.log('Fetched Chats:', fetchedChats);

      setChats(fetchedChats);

      if (fetchedChats.length > 0) {
        setSelectedChat(fetchedChats[0]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  return (
    <div className="contact-center">
      <Sidebar />
      <ChatList 
        chats={chats} 
        onSelectChat={setSelectedChat} 
        selectedChatId={(selectedChat?._id )}  
        ticketId={ticketId} 
      />
      {selectedChat && (
        <>
          <ChatWindow chat={selectedChat}  setChat={setChats} />
          <ChatUserDetails chat={selectedChat}  />
        </>
      )}
    </div>
  );
}

export default ContactCenter;
