import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const ChatUserDetails = ({ chat }) => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [status, setStatus] = useState(null);
  const [selectedTeammate, setSelectedTeammate] = useState(null);
  const [showTeammates, setShowTeammates] = useState(false);
  const [showClosePopup, setShowClosePopup] = useState(false);
  const [showTicketAssignPopup, setShowTicketAssignPopup] = useState(false);
  const [teammates, setTeammates] = useState([]);
  const [selectedTeammateId, setSelectedTeammateId] = useState(null); 

  const senderuserId = localStorage.getItem('chatSenderId');
  const userId = localStorage.getItem('userId');
  const ticketId = localStorage.getItem('ticketId');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:9001/Chatbot/getchatbotuserdetails/${senderuserId}`);
        setUserDetails({
          name: res.data.data.chatbotregisteredUsername || '',
          phone: res.data.data.chatbotregisteredPhone || '',
          email: res.data.data.chatbotregisteredEmail || '',
        });
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    if (senderuserId) {
      fetchUserDetails();
    }
  }, [senderuserId]);

  const fetchTeammates = async () => {
    try {
      const res = await axios.get(`http://localhost:9001/TeamMember/getallteammembers/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTeammates(res.data.teamMembers);
    } catch (error) {
      console.error('Failed to fetch teammates:', error);
    }
  };

  useEffect(() => {
    fetchTeammates();
  }, []);

  const changeTicketStatus = async (selctedstatus) => {
    try {
      const res = await axios.put(`http://localhost:9001/Ticket/updateticketstatus/${ticketId}`, {
        ticketStatus: selctedstatus.value,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setShowClosePopup(true);
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  const assignTicketToTeammate = async (teammateId) => {
    try {
      const res = await axios.post(`http://localhost:9001/Ticket/assigntickettoteammember/${ticketId}`, {
        teamMemberId: teammateId,
        AdminUserId: userId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      setShowTicketAssignPopup(false);
      alert('Ticket successfully assigned to ' + selectedTeammate);
    } catch (error) {
      console.error('Failed to assign ticket to teammate:', error);
    }
  };

  const handleTeammateClick = (teammate) => {
    setSelectedTeammate(teammate.FullName);
    setSelectedTeammateId(teammate._id);  
    setShowTeammates(false);
    setShowTicketAssignPopup(true);
  };

  return (
    <div className="chat-details">
      <h3>Details</h3>
      <input type="text" value={userDetails.name} readOnly />
      <input type="text" value={userDetails.phone} readOnly />
      <input type="text" value={userDetails.email} readOnly />

      <h3>Teammates</h3>
      <div
        className="teammate-dropdown"
        onClick={() => setShowTeammates(!showTeammates)}
        style={{
          border: '1px solid #ccc',
          padding: '5px',
          cursor: 'pointer',
        }}
      >
        {selectedTeammate || 'Select Teammate'}
      </div>

      {showTeammates && (
        <div
          className="teammate-list"
          style={{
            padding: '5px',
            marginTop: '5px',
            maxHeight: '150px',
            overflowY: 'auto',
            backgroundColor: '#fff',
          }}
        >
          {teammates.map((teammate, index) => (
            <div
              key={index}
              onClick={() => handleTeammateClick(teammate)}
              style={{
                padding: '5px',
                cursor: 'pointer',
                borderBottom: '1px solid #D1D6DA',
              }}
            >
              {teammate.FullName}
            </div>
          ))}
        </div>
      )}

      <h3>Ticket Status</h3>
      <Select
        value={status}
        onChange={(selectedOption) => {
          setStatus(selectedOption);
          changeTicketStatus(selectedOption);
          setShowClosePopup(true);
        }}
        options={[
          { value: 'Resolved', label: 'Resolved' },
          { value: 'UnResolved', label: 'Unresolved' },
        ]}
        placeholder={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="./Ticket.png"
              alt="Ticket Status"
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            Ticket Status
          </div>
        }
        styles={{
          control: (base) => ({
            ...base,
            background: 'white',
            border: '1px solid #ccc',
            boxShadow: 'none',
            '&:hover': {
              border: '1px solid #aaa',
            },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
        }}
      />

      {showTicketAssignPopup && (
        <div className="popup-overlay" style={{
          position: 'absolute', top: 370, left: 1275, right: 0, bottom: 0, width: '30%', height: '30%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 10000,
        }}>
          <div className="popup-content" style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '8px',
            textAlign: 'center', maxWidth: '300px', width: '100%',
          }}>
            <h2>Assign Ticket</h2>
            <p>Are you sure you want to assign this ticket to <strong>{selectedTeammate}</strong>?</p>
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => setShowTicketAssignPopup(false)}
                style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#ccc', border: 'none', borderRadius: '14px', width: '120px', height: '40px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  assignTicketToTeammate(selectedTeammateId); 
                  setShowTicketAssignPopup(false);
                }}
                style={{ padding: '8px 16px', backgroundColor: '#184E7F', color: 'white', border: 'none', borderRadius: '14px', width: '120px', height: '40px' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {
        showClosePopup && (
          <div className="popup-overlay" style={{
            position: 'absolute', top: 370, left: 1275, right: 0, bottom: 0, width: '30%', height: '30%',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 10000,
          }}>
            <div className="popup-content" style={{
              backgroundColor: 'white', padding: '20px', borderRadius: '8px',
              textAlign: 'center', maxWidth: '300px', width: '100%',
            }}>
              <h2>Chat will be closed</h2>
              <p>The ticket has been successfully closed.</p>
              <button
                onClick={() => setShowClosePopup(false)}
                style={{ padding: '8px 16px', backgroundColor: '#184E7F', color: 'white', border: 'none', borderRadius: '14px', width: '120px', height: '40px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowClosePopup(false)}
                style={{ padding: '8px 16px', backgroundColor: '#184E7F', color: 'white', border: 'none', borderRadius: '14px', width: '120px', height: '40px' }}
              >
                Confirm
              </button>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default ChatUserDetails;
