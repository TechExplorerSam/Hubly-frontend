import React, { useState, useEffect } from 'react';
import Sidebar from '../Components(Reusable)/Sidebar';
import './UserDashboard.css';
import axios from 'axios';
import { useTicket } from '../ContextProvider/TicketContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All Tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const ticketStatuses = ['All Tickets', 'Resolved', 'Unresolved'];
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const { setTicketId, setTicketName } = useTicket();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [userDetailsMap, setUserDetailsMap] = useState({});


  const handleTicketClick = (ticketId) => {
    setTicketId(ticketId); 
    navigate('/contactcenter'); 
    
  };

  useEffect(() => {
    if (searchQuery.length > 0) return; 
  
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://hubly-backend-ufnp.onrender.com/Ticket/getalltickets/${userId}`, {
          params: {
            status: activeTab === 'All Tickets' ? null : activeTab.toLowerCase(),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const ticketData = response.data.tickets;
        setTickets(Array.isArray(ticketData) ? ticketData : ticketData ? [ticketData] : []);
        setLoading(false);
        console.log('Fetched tickets:', ticketData);
        const uniqueUserIds = [...new Set(ticketData.map(ticket => ticket.ticketCreatedByUser))];

const userDetailsPromises = uniqueUserIds.map(async (userId) => {
  try {
    console.log('Fetching user details for:', userId);
    const res = await axios.get(`https://hubly-backend-ufnp.onrender.com/Chatbot/getchatbotuserdetails/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { userId, details: res.data.data };
  } catch (err) {
    console.error(`Failed to fetch user for ${userId}`, err);
    return { userId, details: null };
  }
});

const userResults = await Promise.all(userDetailsPromises);

const userDetailsObject = {};
userResults.forEach(({ userId, details }) => {
  if (details) {
    userDetailsObject[userId] = {
      UserName: details.chatbotregisteredUsername || '',
      UserPhone: details.chatbotregisteredPhone || '',
      UserEmail: details.chatbotregisteredEmail || '',
    };
  }
});
setUserDetailsMap(userDetailsObject);

        

       
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchTickets();
  }, [activeTab, searchQuery]); 
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
  
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://hubly-backend-ufnp.onrender.com/Ticket/searchticket`, {
          params: { searchQuery },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Search response:', response.data);
        const ticketData = response.data.tickets;
        setSearchResults(Array.isArray(ticketData) ? ticketData : ticketData ? [ticketData] : []);
        setLoading(false);
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults([]);
        setLoading(false);
      }
    };
  
    fetchSearchResults();
  }, [searchQuery]);
    

 const categorizedTickets = {
    resolved: tickets.filter(ticket => ticket.ticketStatus === 'Resolved'),
    unresolved: tickets.filter(ticket => ticket.ticketStatus !== 'Resolved'),
    all: tickets
  };
  function formatTimeDifference(updatedAt, postedTime) {
    const diffMs = new Date(updatedAt) - new Date(postedTime);
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
  
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }
  
 
 
  
 
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className='dashboard_container'>
        <h1 className='dashboard_heading'>Dashboard</h1>
        
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search for ticket" 
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="ticket-status-tabs">
          {ticketStatuses.map((status) => (
            <button 
              key={status}
              className={`status-tab ${activeTab === status ? 'active' : ''}`}
              onClick={() => setActiveTab(status)}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="tickets-container">
          {loading ? (
            <div className="loading-message">Loading tickets...</div>
          ) : error ? (
            <div className="error-message">Error: {error}</div>
          ) : searchQuery.trim() !== '' ? (
            searchResults.length > 0 ? (
              searchResults.map((ticket) => (
                <>
               
                <div key={ticket._id}  className="ticket-card">
                  <div className="ticket-header">
                    <span className="ticket-id">Ticket: {ticket.ticketTitle}</span>
                
                    <span className="ticket-posted">
                      Posted at {new Date(ticket.ticketPostedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="ticket-message">
                    <h2>{ticket.ticketDescription}</h2>
                    <span className="message-time">
                      {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className='time-difference-between-post-and-seen'>
                    <span className="time-difference">
                    {formatTimeDifference(ticket.updatedAt, ticket.ticketPostedTime)}                    </span>
                    <button className={`status-button ${ticket.ticketStatus.toLowerCase()}`}>
                    {ticket.ticketStatus}
                  </button>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleTicketClick(ticket._id);
                    }}
                    className="view-ticket-button"
                  >
                    Open Ticket
                  </a>
                  </div>
                  

               
                
                </div>
                </>
                
              ))
            ) : (
              <div className="no-tickets-message">No tickets match your search</div>
            )
          ) : activeTab === 'Unresolved' ? (
            categorizedTickets.unresolved.length > 0 ? (
              categorizedTickets.unresolved.map((ticket) => (
                <div key={ticket._id} className="ticket-card">
                  <div className="ticket-header">
                    <span className="ticket-id">Ticket: {ticket.ticketTitle}</span>
                    <span className="ticket-posted">
                      Posted at {new Date(ticket.ticketPostedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
              
                  <div className="ticket-message">
                    <h2>{ticket.ticketDescription}</h2>
                  </div>
                  <div className="ticket-footer">
                     <button className={`status-button ${ticket.ticketStatus.toLowerCase()}`}>
                    {ticket.ticketStatus}
                  </button>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();  
                      handleTicketClick(ticket._id);  
                    }}
                    className="view-ticket-button"
                  >
                    Open Ticket
                  </a>

                  </div>
                     
                  {userDetailsMap[ticket.ticketCreatedByUser] && (
  <div className="user-info">
    <div className="user-name"> {userDetailsMap[ticket.ticketCreatedByUser].UserName}</div>
    <div className="user-phone"> {userDetailsMap[ticket.ticketCreatedByUser].UserPhone}</div>
    <div className="user-email"> {userDetailsMap[ticket.ticketCreatedByUser].UserEmail}</div>
  </div>
)}
                </div>
              ))
            ) : (
              <div className="no-tickets-message">No unresolved tickets found</div>
            )
          ) : (
            tickets.length > 0 ? (
              (searchQuery.length > 0 ? searchResults : (
                activeTab === 'Resolved' ? categorizedTickets.resolved :
                activeTab === 'Unresolved' ? categorizedTickets.unresolved :
                tickets
              )).map((ticket) => (
                <div key={ticket._id} className="ticket-card">
                  <div className="ticket-header">
                    <span className="ticket-id">Ticket: {ticket.ticketTitle}</span>
                    <span className="ticket-posted">
                      Posted at {new Date(ticket.ticketPostedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
              
                  <div className="ticket-message">
                    <h2>{ticket.ticketDescription}</h2>
                    <span className="message-time">
                      {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className='time-difference-between-post-and-seen'>
                    <span className="time-difference">
                     {formatTimeDifference(ticket.updatedAt, ticket.ticketPostedTime)}
                     
                    </span>
                  </div>
               

                  <div className="ticket-footer">
                  <button className={`status-button ${ticket.ticketStatus.toLowerCase()}`}>
                    {ticket.ticketStatus}
                  </button>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();  
                      handleTicketClick(ticket._id);  
                    }}
                    className="view-ticket-button"
                  >
                    Open Ticket
                  </a>
                     </div>
                  {userDetailsMap[ticket.ticketCreatedByUser] && (
  <div className="user-info">
    <div className="user-image"> <img src='./User.png'></img></div>
    <div className="user-name"> {userDetailsMap[ticket.ticketCreatedByUser].UserName}</div>
    <div className="user-phone"> {userDetailsMap[ticket.ticketCreatedByUser].UserPhone}</div>
    <div className="user-email"> {userDetailsMap[ticket.ticketCreatedByUser].UserEmail}</div>
  </div>
)}
                </div>
              ))
            ) : (
              <div className="no-tickets-message">No tickets found</div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
