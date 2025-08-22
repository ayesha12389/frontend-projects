import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import InfoCards from './components/InfoCards'
import './Home.css'
import InfoSection from './components/InfoSection'
import FeaturedServices from './components/FeaturedServices'
import ServiceHighlights from './components/ServiceHighlights'
import ServiceSection from './components/ServiceSection'
import Advantages from './components/Advantages'
import TechnicianSection from './components/TechnicianSection'
import Testimonials from './components/Testimonials';
import FooterSection from './components/FooterSection'
function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <InfoCards/>
      <InfoSection/>
      <FeaturedServices/>
      <ServiceHighlights/>
      <ServiceSection/>
      <Advantages/>
      <TechnicianSection/>
      <Testimonials/>
      <FooterSection/>
    </div>
  )
}

export default Home
