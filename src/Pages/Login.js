import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useAuth } from '../ContextProvider/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://hubly-backend-ufnp.onrender.com//User/login', {
        username: formData.username,
        password: formData.password,
      });

      console.log(response.data);

      
      localStorage.setItem('token', response.data.user.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userId', response.data.user._id);
       login();
      alert('Login successful!');
      
      window.location.href = '/dashboard';
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Invalid credentials! Try again.');
    }
  };

  return (
    <div>
      <div className="login_container">
        <div className="login_content">
          <img src="./logo2.png" alt="" style={{ width: '10vw', position: 'absolute', top: '5%' }} className='login-logo'/>
          <h1 className="login_heading">Sign in to your Plexify</h1>

          <form className="login_form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />

            <button type="submit" className="login_btn">Log in</button>
          </form>

          <p className="login_footer">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>

        <div className="login_image">
          <img src="./image_1.png" alt="Login" className="login_img" />
        </div>
      </div>

      <div className="p-container">
        <p className="p2">
          This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
        </p>
      </div>
    </div>
  );
};

export default Login;
