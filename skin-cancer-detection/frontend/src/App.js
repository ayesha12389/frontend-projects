import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Hero from "./components/Hero";
import InfoSection from "./components/InfoSection";
import WhyDetection from "./components/WhyDetection";
import Features from "./components/Features";
import Services from "./components/Services";
import Footer from "./components/Footer";

import Login from "./components/auth/Login";
import About from "./components/About";
import Contact from "./components/Contact";

function App() {
  const location = useLocation();

  const noNavbarRoutes = ["/login", "/about", "/contact"];

  return (
    <>
      {}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        {}
        <Route path="/" element={
          <>
            <Carousel />
            <Hero />
            <InfoSection />
            <WhyDetection />
            <Features />
            <Services />
            <Footer />
          </>
        } />

        {}
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
