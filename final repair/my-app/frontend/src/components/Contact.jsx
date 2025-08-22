import React from 'react'
import InfoCards from './InfoCards'
import ContactForm from './ContactForm'
import Navbar from './Navbar';
import Footer from './FooterSection';


function Contact() {
  return (
    <div>
    <Navbar/>
      {/* Header Section */}
      <div className="image-section">
        <div className="image-overlay">
          <div className="text-content text-center">
            <h1 className="image-title">Auto Repair since 2024</h1>
            <p className="image-subtitle">Contact Us</p>
          </div>

        </div>
      </div>
      <InfoCards/>
      <ContactForm/>
      <Footer/>
    </div>
   
  )
}

export default Contact
