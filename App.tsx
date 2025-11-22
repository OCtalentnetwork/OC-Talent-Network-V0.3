import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Consultation from './pages/Consultation';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-octn-dark selection:bg-octn-purple selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/about" element={
            <div className="p-20 text-center">
              <h1 className="text-4xl font-black uppercase">About OCTN</h1>
              <p className="mt-4 text-lg">Specializing in Architecture, Engineering, and Construction talent.</p>
            </div>
          } />
        </Routes>
        <footer className="bg-black text-white py-8 text-center border-t-4 border-octn-blue mt-auto">
          <p className="font-bold uppercase tracking-widest text-sm">
            © {new Date().getFullYear()} Open Concept Talent Network
          </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;