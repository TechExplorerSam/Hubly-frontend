import React from 'react'
import Header from '../Components(Reusable)/Header'
import './Landingpage.css'
import { ArrowRight } from 'lucide-react';
import { FaPlayCircle } from 'react-icons/fa';
import Footer from '../Components(Reusable)/Footer';
import MainChatbot from './MainChatbot';
const Landingpage = () => {
  return (
    <div className='main'>
      <Header />
      <div className="landingpage_container">
   
  <div className="content">
    <h1 className='heading1'>
      Grow Your Business Faster <br /> with Hubly CRM
    </h1>
    <p>
      Manage leads, automate workflows, and close deals effortlessly—all in one powerful platform.
    </p>
    <div className="button_container">
      <button className='btn'>
        Get Started <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
      </button>
      <button className='btn2'>
        <FaPlayCircle size={30} style={{ marginRight: '0.5rem', color: "#244779" }} />
        Watch Video
      </button>
    </div>
  </div>

  
  <div className="image">
    <img src="Card_1.png" alt="" className='img' />
    <img src='./img1.png' alt='' className='img1' />
    <img src='./Calendar.png' alt='' className='img2' />
    <img src='./Img2.png' alt='' className='img3' />
   
  
  </div>
 
</div>
<section className='section1'>
  <img src='./Companies.png' alt='' className='img4' />
  
  
 </section>
 <div className="content_1">
    <h1 className='heading2'>At its core, Hubly is a robust CRM <br></br> &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    solution.</h1>
    <p>
    Hubly helps businesses streamline customer interactions, track leads, and automate tasks—<br></br>saving you time and maximizing revenue. Whether you’re a startup or an enterprise, Hubly<br></br> adapts to your needs, giving you the tools to scale efficiently.
    </p>
   
  </div>
  <section className='section2'>
    <div className="content_2">
      <h1 className='heading3'>MULTIPLE PLATFORMS TOGETHER!</h1>
      <p>
      Email communication is a breeze with our fully integrated, drag & drop<br></br> email builder.      </p>
      <h1 className='heading3'>CLOSE</h1>
      <p>
      Capture leads using our landing pages, surveys, forms, calendars, inbound phone <br></br> system & more!      </p>
      <h2 className='heading3'>NURTURE</h2>
      <p>
      Capture leads using our landing pages, surveys, forms, calendars, inbound <br></br>phone system & more!      </p>
    </div>
    <div className="image_2">
      <img src='./CaptureNuture.png' alt='' className='img5' />
    </div>
  </section>
  <div className="content_3">
    <h1 className='heading4'>We have plans for everyone!</h1>
    <p>
    We started with a strong foundation, then simply built all of the sales and <br></br> marketing tools ALL businesses need under one platform.    </p>
  
      </div>
      <div className='subscription_container'>
        <div className="subscription">
          <h1 className='heading5'>STARTER
        </h1>
          <p>Best for local businesses needing to improve their online <br></br> reputation.</p>
          <h2><span>$199</span>/monthly</h2>
          <h3>
            What's included?
          </h3>
          <ul style={{ listStyleImage: 'url("Check_icon.png")' }}>
            <li>Unlimited Users</li>
            <li>GMB Messaging</li>
            <li>Reputation Management</li>
            <li>GMB Call Tracking</li>
            <li>24/7 Award Winning Support</li>
            
            </ul>
          <button className='btn3'>SIGN UP FOR STARTER</button>
        </div>
 <div className="subscription">
          <h1 className='heading5'>GROW</h1>
          <p>Best for all businesses that want to take full control of their<br></br> marketing automation and track their leads, click to close.</p>
          <h2><span>$399</span>/monthly</h2>
          <h3>
            What's included?
          </h3>
          <ul style={{ listStyleImage: 'url("Check_icon.png")' }}>
            <li>Pipeline Management</li>
            <li>Marketing Automation Campaigns</li>
            <li>Live Call Transfer</li>
            <li>GMB Messaging</li>
            <li>Embed-able Form Builder</li>
            <li>Reputation Management</li>
            <li>24/7 Award Winning Support</li>
            
            </ul>
          <button className='btn3'>SIGN UP FOR STARTER</button>
        </div>
         
      </div>
      <MainChatbot />
      <Footer />
   
    </div>
  )
}

export default Landingpage