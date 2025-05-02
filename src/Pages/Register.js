import React, { useState } from 'react';
import './Register.css';
import axios from 'axios'; 

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('https://hubly-backend-ufnp.onrender.com//User/registeranewuser', {
        firstName: formData.firstname,
        lastName: formData.lastname,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      console.log(response.data); 
      alert('User Account created successfully!');
     
      window.location.href = '/login';
      const token = response.data.token;
      localStorage.setItem('token', token);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Registration failed! Try again.');
    }
  };

  return (
    <div>
      <div className='signup_container'>
        <img src='./logo2.png' alt='' style={{ width: '10vw', position: 'absolute', top: '5%', left: '5%' }} />

        <div className='signup_form'>
          <h1 className='signup_heading'>
            Create an account <span><a href="/login">Sign in instead</a></span>
          </h1>

          <form className='signup_form_content' onSubmit={handleSubmit}>
            <label htmlFor="Firstname">Firstname</label>
            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />

            <label htmlFor="Lastname">Lastname</label>
            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
            <label htmlFor="Lastname">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />

            <label htmlFor="Email">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label htmlFor="Password">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />

            <label htmlFor="ConfirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

            <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
              <input 
                type="checkbox" 
                style={{ 
                  width: "19px", 
                  height: "19px", 
                  accentColor: "black", 
                  marginRight: "10px", 
                  marginLeft: "40px", 
                  marginTop: "5px",
                }} 
              />
              <p style={{ fontSize: "20px", color: "#525252", marginTop: "15px", marginLeft: "10px" }}>
                By creating an account, I agree to our 
                <span style={{ display:'inline-block', textDecoration: "underline" }}> Terms of use </span> <br/>
                &nbsp;&nbsp;&nbsp; and <span style={{ textDecoration: "underline", display:'inline-block' }}>Privacy Policy</span>
              </p>
            </div>

            <button type="submit" className="signup_btn">Create an account</button>
          </form>

          <div className="p-container1">
            <p className="p21">
              This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
            </p>
          </div>
        </div>

        <div className="signup_image">
          <img src="./image_1.png" alt="Login" className="signup_img" />
        </div>
      </div>
    </div>
  );
};

export default Register;
