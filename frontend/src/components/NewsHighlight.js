import React, { useState, useEffect } from 'react';
import { newsArticles } from '../Data/newsData'; 


const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

function NewsHighlight() {
  const [randomArticles, setRandomArticles] = useState([]);

  useEffect(() => {
    const shuffled = shuffleArray([...newsArticles]); 
    setRandomArticles(shuffled.slice(0, 3)); 
  }, []); 

  return (
    <section className="news-highlight-section">
      <div className="container">
        <h2>Fique por Dentro</h2>
        <p className="section-subtitle">Informações e artigos para ampliar a conversa sobre saúde mental.</p>
        <div className="articles-grid">
          {randomArticles.map((article, index) => (
            <a href={article.link} key={index} className="article-card" target="_blank" rel="noopener noreferrer">
              <div className="article-content">
                <span className="article-source">{article.date}</span>
                <h3 className="article-title">{article.title}</h3>
                <p className="article-summary">{article.summary}</p>
                <span className="read-more">Ler mais →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsHighlight;