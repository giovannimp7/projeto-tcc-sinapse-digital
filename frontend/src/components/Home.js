import React from 'react';
import { Link } from 'react-router-dom';
import Chatbot from './Chatbot';
import NewsHighlight from './NewsHighlight';

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Um espaço seguro para o primeiro passo.</h1>
          <p className="section-subtitle">
            Converse com a Serena, nossa assistente de acolhimento digital.
          </p>
          
          <div className="home-chatbot-container">
            <Chatbot isHome={true} />
          </div>

          <div style={{marginTop: '40px'}}>
            <p>Ou, se preferir, comece por uma autoavaliação estruturada:</p>
            <Link to="/questionario" className="cta-button" style={{marginTop: '15px'}}>
              Ir para o Questionário
            </Link>
          </div>
          
        </div>
      </section>

      <NewsHighlight />
    </main>
  );
}

export default Home;