import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './components/Home';
import OProjeto from './pages/OProjeto';
import Noticias from './pages/Noticias';
import BusqueAjuda from './pages/BusqueAjuda';
import SobreMim from './pages/SobreMim';
import Questionario from './pages/Questionario';
import './App.css';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  const toggleFloatingChat = () => {
    setIsFloatingChatOpen(prev => !prev);
  };

  return (
    <div className="app-wrapper">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/o-projeto" element={<OProjeto />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/busque-ajuda" element={<BusqueAjuda />} />
          <Route path="/sobre-mim" element={<SobreMim />} />
          <Route path="/questionario" element={<Questionario />} />
        </Routes>
      </main>

      {!isHomePage && (
        <>
          {isFloatingChatOpen ? (
            <Chatbot isHome={false} onClose={toggleFloatingChat} />
          ) : (
            <button className="chatbot-toggle-button" onClick={toggleFloatingChat}>
              SD
            </button>
          )}
        </>
      )}
      
      <Footer />
    </div>
  );
}

export default App;