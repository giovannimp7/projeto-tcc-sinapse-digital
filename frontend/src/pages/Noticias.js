import React from 'react';
import { newsArticles } from '../Data/newsData'; 

function Noticias() {
  return (
    <div className="page-content fade-in">
      <div className="container">
        <h1>Notícias e Artigos</h1>
        <hr />

        <div className="articles-grid">
          {newsArticles.map((article, index) => (
            <a href={article.link} key={index} className="article-card" target="_blank" rel="noopener noreferrer">
              <img src={article.image} alt={article.title} className="article-image" />
              <div className="article-content">
                <span className="article-date">{article.date}</span>
                <h3 className="article-title">{article.title}</h3>
                <p className="article-summary">{article.summary}</p>
                <span className="read-more">Ler mais →</span>
              </div>
            </a>
          ))}
        </div>
        
      </div>
    </div>
  );
}

export default Noticias;