import React, { useState, useEffect } from 'react';
import Sidebar from '../Components(Reusable)/Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
const UserProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isTeamMember, setIsTeamMember] = useState(false);
  const userfromlocalstorage = localStorage.getItem('user');
  const user = JSON.parse(userfromlocalstorage);
  const userisTeamMember=user.isTeamMember;
  
  const [prevData, setPrevData] = useState({
    email: '',
    password: '',
  });
const navigate = useNavigate();
  const [hasEmailOrPasswordChanged, setHasEmailOrPasswordChanged] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUserDetails();
  }, []);
 
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:9001/User/getUserDetails/${userId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
  
      const userfromlocalstorage = localStorage.getItem('user');
      const user = JSON.parse(userfromlocalstorage);
      const userisTeamMember = user.isTeamMember;
      setIsTeamMember(userisTeamMember); 
  
      if (userisTeamMember) {
        const { firstName, lastName, email, phone } = response.data.user;
        setFormData({
          firstName,
          lastName,
          email,
          phone,
          password: '',
          confirmPassword: ''
        });
      } else {
        const { firstName, lastName, email } = response.data.user;
        setFormData({
          firstName,
          lastName,
          email,
          password: '',
          confirmPassword: ''
        });
      }
  
      setPrevData({ email: response.data.email, password: '' });
      setHasEmailOrPasswordChanged(false);
  
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email' || name === 'password' || name === 'confirmPassword') {
      setHasEmailOrPasswordChanged(true);
    }
  };
  

  const updateUserDetails = async (e) => {
    e.preventDefault();
    const { firstName, lastName } = formData;

    try {
     
     
      
      if(userisTeamMember){
        
       const FullName = firstName + ' ' + lastName;
       const phone = formData.phone;
        const userId = localStorage.getItem('userId');
     try{  const response= await axios.put(`http://localhost:9001/User/updateuser/${userId}`, { FullName,phone }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        console.log('Response:', response.data);
        
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          password: '',
          confirmPassword: ''
        });

        alert('Profile updated of Team Member successfully');
        return;
      }
      catch(error){
        console.error('Error updating profile:', error);
        alert('Error updating profile');
      }
      }
      await axios.put(`http://localhost:9001/User/updateuser/${userId}`, { firstName, lastName }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (hasEmailOrPasswordChanged) {
        await updateEmailOrPassword();
      } else {
        alert('Profile updated successfully');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating profile');
    }
  };

  const updateEmailOrPassword = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const credentials = {
      email: formData.email !== prevData.email ? formData.email : undefined,
      password: formData.password.length > 0 ? formData.password : undefined
    };

    try {
      await axios.put(`http://localhost:9001/User/updateemailorpassword/${userId}`, credentials, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      alert('Email and/or password updated successfully. You will be logged out.');
      
     

      setPrevData({ email: formData.email, password: formData.password });
      setFormData({ ...formData, password: '', confirmPassword: '' }); 
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/'); 
      setHasEmailOrPasswordChanged(false);
    } catch (error) {
      console.error(error);
      alert('Error updating email or password');
    }
  };

  return (
    <div >
        
        <Sidebar />
     
     <div className='user_edit_profile_container'>
       <h1 className='user_edit_profile_heading'>Settings</h1>
       <div className='user_edit_profile_name_container'>
         <h3>Edit Profile</h3>
       </div>

       <form className='user_edit_profile_details_form' onSubmit={updateUserDetails}>
  <div className="input-container">
    <label>First Name</label>
    <input type='text' name='firstName' value={formData.firstName} onChange={handleInputChange} />
  </div>

  <div className="input-container">
    <label>Last Name</label>
    <input type='text' name='lastName' value={formData.lastName} onChange={handleInputChange} />
  </div>
  {isTeamMember && (
  <div className="input-container">
    <label>Phone</label>
    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
  </div>
)}
 
  <div className="input-container">
    <label>Email</label>
    <div className="input-with-tooltip">
      <input type='email' name='email' value={formData.email} onChange={handleInputChange} />
      <div className="tooltip-container">
        <h4 className="info-icon">i</h4>
        <div className="tooltip-text">Changing Email will log you out immediately after saving</div>
      </div>
    </div>
  </div>


  <div className="input-container">
    <label>Type New Password</label>
    <div className="input-with-tooltip">
      <input type='password' name='password' value={formData.password} onChange={handleInputChange} disabled={isTeamMember?true:false}/>
      <div className="tooltip-container">
      <h4 className="info-icon">i</h4>
        <div className="tooltip-text">{isTeamMember?"You are not admin so you cannot change you own password as your logged in password is admins passwordy.":"Changing Password will log you out immediately after saving"}</div>
      </div>
    </div>
  </div>

 
  <div className="input-container">
    <label>Type New Confirm Password</label>
    <div className="input-with-tooltip">
      <input type='password' name='confirmPassword' value={formData.confirmPassword} onChange={handleInputChange} disabled={isTeamMember?true:false}/>
      <div className="tooltip-container">
      <h4 className="info-icon">i</h4>
        <div className="tooltip-text">{isTeamMember?"You are not admin so you cannot change you own password as your logged in password is admins passwordy.":"Please retype your new password carefully.After typing and saving you will be logged out"}</div>
      </div>
    </div>
  </div>

  <button className='save_button'>
    Save
  </button>
</form>


     </div>   
        </div>
     
    
  );
};

export default UserProfile;