import './App.css';
import { Routes, Route } from 'react-router-dom';
import AboutMe from './components/AboutMe';
import Banner from './components/Banner';
import Navbar from './components/Navbar';
import ScrollProgressIndicator from './components/ScrollProgressIndicator';
import { useState } from 'react';
import Skills from './components/Skills';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import Footer from './components/Footer';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <ScrollProgressIndicator />
      <Navbar setIsMenuOpen={setIsMenuOpen} />
      <Routes>
        <Route path="/" element={
          <>
            <Banner isMenuOpen={isMenuOpen} />
            <AboutMe />
            <Skills />
            <ProjectList />
            <Footer />
          </>
        } />
        <Route path="/projects/:slug" element={
          <>
            <ProjectDetails />
            <Footer />
          </>
        } />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
