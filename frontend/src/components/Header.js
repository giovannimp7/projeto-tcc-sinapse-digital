import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <div className="container">
        <div className="site-name"><Link to="/">Sinapse Digital</Link></div>

        <nav className={isMenuOpen ? 'open' : ''}>
          <Link to="/o-projeto" onClick={closeMenu}>O Projeto</Link>
          <Link to="/noticias" onClick={closeMenu}>Notícias</Link>
          <Link to="/busque-ajuda" onClick={closeMenu}>Busque Ajuda</Link>
          <Link to="/sobre-mim" onClick={closeMenu}>Sobre Mim</Link>
          <Link to="/questionario" onClick={closeMenu}>Começar Anamnese</Link>
        </nav>

        <button className="hamburger-menu" onClick={toggleMenu}>
          {isMenuOpen ? '×' : '☰'}
        </button>
      </div>
    </header>
  );
}

export default Header;