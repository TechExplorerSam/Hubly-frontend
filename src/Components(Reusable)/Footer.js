import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <div>
        <footer className="footer">
           <div className="footer_content">
            <img src="./logo2.png" alt="" className='footer_logo' />
            <div className="footer_links">
                <h1>Product</h1>
                <ul>
                    <li>Universal checkout</li>
                    <li>Payment workflows</li>
                    <li>Observability</li>
                    <li>UpliftAI</li>
                    <li>Apps & integrations</li>
                </ul>
                </div>
                <div className="footer_links">
                <h1>Why Primer</h1>
                <ul>
                    <li>Expand to new markets</li>
                    <li>Boost payment success</li>
                    <li>Improve conversion rates</li>
                    <li>Reduce payments fraud</li>
                    <li>Recover revenue</li>

                </ul>
                </div>
                <div className="footer_links">
                <h1>Developers</h1>
                <ul>
                    <li>Primer Docs</li>
                    <li>API Reference</li>
                    <li>Payment methods guide</li>
                    <li>Service status</li>
                    <li>Community</li>
                </ul>
                </div>
                <div className="footer_links">
                <h1>Resources</h1>
                <ul>
                    <li>Blog</li>
                    <li>Success stories</li>
                    <li>News room</li>
                    <li>Terms</li>
                    <li>Privacy</li>

                </ul>
                </div>
                <div className="footer_links">
                <h1>Company</h1>
                <ul>
                
                    <li>Careers</li>
                    
                    </ul>
                </div>
              <div className='social_media'>
                <img src="./mail.png" alt="" className='social_media_icon' />
                <img src="./linkedin.png" alt="" className='social_media_icon' />
                <img src="./Twitter.png" alt="" className='social_media_icon' />
                <img src="./Youtube.png" alt="" className='social_media_icon' />
                <img src="./Insta.png" alt="" className='social_media_icon' />
                </div>
            
            </div> 
        </footer>
    </div>
  )
}

export default Footer