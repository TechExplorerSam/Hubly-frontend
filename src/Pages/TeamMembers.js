import React, { useState, useEffect } from 'react';
import Sidebar from '../Components(Reusable)/Sidebar';
import './TeamMembers.css';
import axios from 'axios'; 
const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [displayPopup, setDisplayPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editMemberId, setEditMemberId] = useState(null);
  const [newMember, setNewMember] = useState({
    FullName: '',
    Role: 'TeamMember',
    Phone: '',
    Email: '',
   
  });
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await axios.get(`https://hubly-backend-ufnp.onrender.com/TeamMember/getallteammembers/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('API Response:', res.data);
        
        if (res.data && Array.isArray(res.data.teamMembers)) {
          setTeamMembers(res.data.teamMembers);
        } else {
          console.error('No team members found in the response');
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
      }
    };
  
    fetchTeamMembers();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
    
   
  }

  const handleAddMember = () => {
    setNewMember({
      FullName: '',
      Role: 'TeamMember',
      Phone: '',
      Email: '',

    });
    setEditIndex(null);
    setDisplayPopup(true);
  };

  const handleEditMember = (index) => {
    setEditIndex(index);
    const member = teamMembers[index];
    setNewMember({
      FullName: member.FullName,
      Role: member.Role,
      Phone: member.Phone,
      Email: member.Email,
    });
    setEditMemberId(member._id);
    setDisplayPopup(true);
  };
  
  const handleSaveMember = async () => {
    if (editIndex !== null && editMemberId) {
      try {
        const res = await axios.put(
          `https://hubly-backend-ufnp.onrender.com/TeamMember/updateteammemberbyid/${editMemberId}`,
          {
            adminUserId: userId,
            UserName: newMember.FullName,
            UserRole: newMember.Role,
            UserPhone: newMember.Phone,
            UserEmail: newMember.Email,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        console.log('Update Response:', res.data);
  
        const updatedMembers = [...teamMembers];
        updatedMembers[editIndex] = { ...newMember, _id: editMemberId };
        setTeamMembers(updatedMembers);
  
        setDisplayPopup(false);
        setEditIndex(null);
        setEditMemberId(null);
      } catch (error) {
        console.error('Error updating team member:', error);
      }
    } else {
      try {
        const res = await axios.post(
          `https://hubly-backend-ufnp.onrender.com/TeamMember/createnewteammember`,
          {
            createdAdminId: userId,
            UserName: newMember.FullName,
            UserPhone: newMember.Phone,
            UserEmail: newMember.Email,
            UserRole: newMember.Role,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        console.log('Add Member Response:', res.data);
        const updatedMembers = [...teamMembers];
        updatedMembers[editIndex] = { ...newMember, _id: editMemberId };
        setTeamMembers(updatedMembers)
  
        setDisplayPopup(false);
        setNewMember({
          FullName: '',
          Role: '',
          Phone: '',
          Email: '',
        });
      } catch (error) {
        console.error('Error adding team member:', error);
      }
    }
  };
  

  const handleClosePopup = () => {
    setDisplayPopup(false);
    setEditIndex(null);
  };

  const handleDeleteMember = (index) => {
    setDeletePopup(true);
    setEditIndex(index); 
  };

  const handleConfirmDelete = async () => {
    try {
      const memberIdToDelete = teamMembers[editIndex]._id; 
      const res = await axios.delete(`https://hubly-backend-ufnp.onrender.com/TeamMember/deleteteammemberbyid/${memberIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Delete Response:', res.data);
  
      const updatedMembers = [...teamMembers];
      updatedMembers.splice(editIndex, 1);
      setTeamMembers(updatedMembers);
  
      setDeletePopup(false);
      setEditIndex(null);
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };
  

  const handleCancelDelete = () => {
    setDeletePopup(false);
    setEditIndex(null);
  };

  return (
    <div className="team-wrapper">
      <Sidebar />
      <div className="team-members">
        <h2 className="main-heading">Team</h2>
        <div className="team-table">
          <div className="team-header">
            <span>Photo</span>
            <span>Full Name</span>
            <span>Phone</span>
            <span>Email</span>
            <span>Role</span>
          </div>
          {teamMembers.length > 0 ? (
  teamMembers.map((member, index) => (
    <div className="team-row" key={index}>
      <div><img src={member?.FullName || ''} alt={member?.FullName || 'Member'} className="team-member-image" /></div>
      <div>{member?.FullName || 'No Name'}</div>
      <div>{member?.Phone || 'No Phone'}</div>
      <div>{member?.Email || 'No Email'}</div>
      <div>{member?.Role || 'No Role'}</div>
      <div className="action-buttons">
        <button className="edit-button" onClick={() => handleEditMember(index)}>
          <img src="./EditIcon.png" alt="Edit" />
        </button>
        <button className="remove-button" onClick={() => handleDeleteMember(index)}>
          <img src="./DeleteIcon.png" alt="Delete" />
        </button>
      </div>
    </div>
  ))
) : (
  <div>No team members available</div>
)}

          <div className="add-member">
            <button className="add-button" onClick={handleAddMember}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6.66699 9.99999H13.3337M10.0003 6.66666V13.3333M18.3337 9.99999C18.3337 14.6024 14.6027 18.3333 10.0003 18.3333C5.39795 18.3333 1.66699 14.6024 1.66699 9.99999C1.66699 5.39762 5.39795 1.66666 10.0003 1.66666C14.6027 1.66666 18.3337 5.39762 18.3337 9.99999Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {editIndex !== null ? 'Update Member' : 'Add Team Member'}
            </button>

            {displayPopup && (
              <div className="popup">
                <div className="popup-content">
                  <h2>{editIndex !== null ? 'Edit Team Member' : 'Add New Team Member'}</h2>
                  <form>
                    <label>UserName:</label>
                    <input type="text" name="FullName" value={newMember.FullName} onChange={handleInputChange} />
                    <label>Role:</label>
<select name="Role" value={newMember.Role} onChange={handleInputChange}>
  <option value="TeamMember">TeamMember</option>
  <option value="Admin">Admin</option>
</select>

                    <label>Phone:</label>
                    <input type="text" name="Phone" value={newMember.Phone} onChange={handleInputChange} />
                    <label>Email:</label>
                    <input type="email" name="Email" value={newMember.Email} onChange={handleInputChange} />
                    <button type="button" className="save-button" onClick={handleSaveMember}>Save</button>
                  </form>
                  <button className="close-button" onClick={handleClosePopup}>Cancel</button>
                </div>
              </div>
            )}

            {deletePopup && (
              <div className="delete-popup">
                <div className="delete-popup-content">
                  <p>Are you sure you want to delete this team member?</p>
                  <button className="confirm-delete-button" onClick={handleConfirmDelete}>Confirm</button>
                  <button className="cancel-delete-button" onClick={handleCancelDelete}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
