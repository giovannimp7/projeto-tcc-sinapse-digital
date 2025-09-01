import React, { useState, useEffect, useRef } from 'react';

// Não precisamos mais de um CSS específico aqui, o global já resolve
// import './Chatbot.css'; 

function Chatbot({ isHome, onClose }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { text: 'Olá! Sou a Serena. Sinta-se à vontade para compartilhar como você está se sentindo.', sender: 'ai' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. MUDANÇA: Vamos usar uma ref para o próprio container do histórico
  const historyContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // 2. MUDANÇA: A lógica de scroll foi ajustada para ser mais precisa
  useEffect(() => {
    const container = historyContainerRef.current;
    if (container) {
      // Em vez de scrollIntoView, definimos a posição do scroll manualmente
      container.scrollTop = container.scrollHeight;
    }
  }, [chatHistory]); // Roda toda vez que o histórico de chat muda

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '49px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const newUserMessage = { text: message, sender: 'user' };
    setChatHistory(prev => [...prev, newUserMessage]);
    setMessage('');
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: message }),
      });
      if (!response.ok) throw new Error(`Erro do servidor: ${response.status}`);
      const data = await response.json();
      const newAiMessage = { text: data.resposta_ia, sender: 'ai' };
      setChatHistory(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Erro ao contatar o chatbot:", error);
      const errorMessage = { text: 'Desculpe, não consigo me conectar no momento. Tente novamente mais tarde.', sender: 'ai' };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const wrapperClassName = isHome ? 'home-chatbot-container' : 'chatbot-wrapper floating';

  return (
    <div className={wrapperClassName}>
      <div className="chatbot-container fade-in">
        <div className="chatbot-header">
          <h2>Acolhimento Digital</h2>
          <p>Converse com a Serena</p>
          {!isHome && (
            <button className="close-chatbot-button" onClick={onClose}>×</button>
          )}
        </div>
        {/* 3. MUDANÇA: A ref agora está no container principal do histórico */}
        <div className="chatbot-history" ref={historyContainerRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}><p>{msg.text}</p></div>
          ))}
          {isLoading && ( <div className="chat-message ai"><p className="loading-dots"><span>.</span><span>.</span><span>.</span></p></div> )}
          {/* A div extra de ref foi removida daqui */}
        </div>
        <div className="chatbot-input">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            rows="1"
          />
          <button onClick={handleSendMessage} disabled={isLoading}>
            &#10148;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;