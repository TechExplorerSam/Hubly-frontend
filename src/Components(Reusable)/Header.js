import React from 'react'
import HeaderStyles from './Header.module.css'
const Header = () => {
  const handleLogin = () => {
    window.location.href = '/login';
  };
  const handleSignUp = () => {
    window.location.href = '/signup';
  };
  return (
   
        <header>
            <img src='./logo2.png' alt=''></img>
           <div className={HeaderStyles.buttoncontainer}>
       
            <>
             <button className={HeaderStyles.btn1} id='btn1'onClick={handleLogin}>Login</button>
             <button className={HeaderStyles.btn2} id='btn2'onClick={handleSignUp}>SignUp</button>
            </>
           
        
           </div>
        </header>
        
   
  )
}

export default Header