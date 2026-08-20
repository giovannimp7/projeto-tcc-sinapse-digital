import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

function Questionario() {

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [scores, setScores] = useState({});
  const [history, setHistory] = useState([]);
  const [showCvvAlert, setShowCvvAlert] = useState(false);
  const [cvvTriggered, setCvvTriggered] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const getAnxietyLevel = (score) => {
    if (score >= 15) return 'Grave';
    if (score >= 10) return 'Moderada';
    if (score >= 5) return 'Leve';
    return 'Mínima';
  };

  const getDepressionLevel = (score) => {
    if (score >= 20) return 'Grave';
    if (score >= 15) return 'Moderadamente Grave';
    if (score >= 10) return 'Moderada';
    if (score >= 5) return 'Leve';
    return 'Mínima';
  };

  useEffect(() => {
    if (showScore) {
      const finalScores = scores;
      const depressionLevel = getDepressionLevel(finalScores.depressao || 0);
      const anxietyLevel = getAnxietyLevel(finalScores.ansiedade || 0);

      const dataToSend = {
        scores: finalScores,
        levels: {
          depression: depressionLevel,
          anxiety: anxietyLevel,
        }
      };
      
      console.log("Enviando os seguintes dados para o back-end:", dataToSend);

      fetch(`${API_URL}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Resposta do back-end:', data);
      })
      .catch((error) => {
        console.error('Erro ao enviar dados:', error);
      });
    }
  }, [showScore, scores]); 
  
  const sections = {
    depressao: [
      { questionText: '1. Ter pouco interesse ou pouco prazer em fazer as coisas' }, { questionText: '2. Sentir-se "para baixo", deprimido(a) ou sem perspectiva' }, { questionText: '3. Dificuldade para pegar no sono ou permanecer dormindo, ou dormir mais do que de costume' }, { questionText: '4. Sentir-se cansado(a) ou com pouca energia' }, { questionText: '5. Ter falta de apetite ou comer demais' }, { questionText: '6. Sentir-se mal consigo mesmo(a) — ou achar que você é um fracasso ou que decepcionou sua família ou você mesmo(a)?' }, { questionText: '7. Ter dificuldade para se concentrar nas coisas, como ler o jornal ou ver televisão?' }, { questionText: '8. Lentidão para se movimentar ou falar, a ponto das outras pessoas perceberem? Ou o oposto – estar tão agitado(a) que você fica andando de um lado para o outro muito mais do que de costume?' }, { questionText: '9. Pensar em se ferir de alguma maneira ou que seria melhor o autoextermínio?' },
    ],
    ansiedade: [
      { questionText: '1. Sentir-se nervoso(a), ansioso(a) ou no limite' }, { questionText: '2. Não ser capaz de parar ou controlar as preocupações' }, { questionText: '3. Preocupar-se muito com diversas coisas' }, { questionText: '4. Ter dificuldade para relaxar' }, { questionText: '5. Ficar tão inquieto(a) que se tornou difícil permanecer parado(a)?' }, { questionText: '6. Ficar facilmente irritado(a) ou irritável?' }, { questionText: '7. Sentir medo como se algo horrível fosse acontecer?' },
    ],
  };
  const answerOptions = [
    { answerText: 'Nenhuma vez', score: 0 }, { answerText: 'Alguns dias', score: 1 }, { answerText: 'Mais da metade dos dias', score: 2 }, { answerText: 'Quase todos os dias', score: 3 },
  ];
  const sectionKeys = Object.keys(sections);

  const advanceAfterAnswer = (score, sectionKey, sectionIdx, questionIdx, currentScores) => {
    const newHistory = [...history, { currentSectionIndex: sectionIdx, currentQuestionIndex: questionIdx, scores: currentScores }];
    setHistory(newHistory);

    const updatedScores = { ...currentScores };
    updatedScores[sectionKey] = (updatedScores[sectionKey] || 0) + score;
    setScores(updatedScores);

    const nextQuestionIndex = questionIdx + 1;
    if (nextQuestionIndex < sections[sectionKey].length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      const nextSectionIndex = sectionIdx + 1;
      if (nextSectionIndex < sectionKeys.length) {
        setCurrentSectionIndex(nextSectionIndex);
        setCurrentQuestionIndex(0);
      } else {
        setShowScore(true);
      }
    }
  };

  const handleAnswerButtonClick = (score) => {
    const currentSectionKey = sectionKeys[currentSectionIndex];
    const isPhq9LastQuestion = currentSectionKey === 'depressao' && currentQuestionIndex === 8;

    if (isPhq9LastQuestion && score > 0) {
      setCvvTriggered(true);
      setPendingAction({ score, sectionKey: currentSectionKey, sectionIdx: currentSectionIndex, questionIdx: currentQuestionIndex, currentScores: scores });
      setShowCvvAlert(true);
      return;
    }

    advanceAfterAnswer(score, currentSectionKey, currentSectionIndex, currentQuestionIndex, scores);
  };

  const handleCvvAlertContinue = () => {
    setShowCvvAlert(false);
    if (pendingAction) {
      const { score, sectionKey, sectionIdx, questionIdx, currentScores } = pendingAction;
      setPendingAction(null);
      advanceAfterAnswer(score, sectionKey, sectionIdx, questionIdx, currentScores);
    }
  };

  const handleBackButtonClick = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setCurrentSectionIndex(lastState.currentSectionIndex);
      setCurrentQuestionIndex(lastState.currentQuestionIndex);
      setScores(lastState.scores);
      setHistory(history.slice(0, -1));
    }
  };
  
  const currentSectionKey = sectionKeys[currentSectionIndex];
  const currentQuestion = sections[currentSectionKey][currentQuestionIndex];
  const totalQuestions = sectionKeys.reduce((total, key) => total + sections[key].length, 0);
  let questionsAnswered = 0;
  for (let i = 0; i < currentSectionIndex; i++) {
    questionsAnswered += sections[sectionKeys[i]].length;
  }
  questionsAnswered += currentQuestionIndex;
  const progressPercentage = (questionsAnswered / totalQuestions) * 100;

  return (
    <div className="page-content fade-in">
        <div className="container">
        <h1>Anamnese Digital</h1>
        <hr />

        {showCvvAlert && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: '#fff', borderRadius: '12px', padding: '2rem',
              maxWidth: '480px', width: '100%', textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{ color: '#c0392b', marginBottom: '0.75rem' }}>Você não está sozinho(a)</h2>
              <p style={{ marginBottom: '1rem' }}>
                Percebemos que você pode estar passando por um momento muito difícil.
                Se você está pensando em se machucar, por favor procure ajuda agora.
              </p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                CVV – Centro de Valorização da Vida
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c0392b', marginBottom: '0.5rem' }}>
                188
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Disponível 24 horas, 7 dias por semana. Gratuito e sigiloso.
                Também pelo site: <a href="https://www.cvv.org.br" target="_blank" rel="noopener noreferrer">www.cvv.org.br</a>
              </p>
              <button onClick={handleCvvAlertContinue} className="cta-button">
                Estou ciente, continuar o questionário
              </button>
            </div>
          </div>
        )}

        {showScore ? (
          <div className="score-section fade-in">
            <h2>Resultado da Autoavaliação</h2>
            <p>Este é um resumo inicial baseado em suas respostas. Ele serve como um ponto de partida para a autoconsciência e não constitui um diagnóstico.</p>

            {cvvTriggered && (
              <div style={{
                backgroundColor: '#fdecea', border: '2px solid #c0392b',
                borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem'
              }}>
                <strong style={{ color: '#c0392b' }}>Atenção:</strong> Você indicou pensamentos de autoextermínio.
                Se precisar de apoio imediato, ligue para o <strong>CVV: 188</strong> (24h, gratuito) ou acesse{' '}
                <a href="https://www.cvv.org.br" target="_blank" rel="noopener noreferrer">www.cvv.org.br</a>.
              </div>
            )}

            <div className="results">
              <h3>Sintomas de Depressão (PHQ-9)</h3>
              <p><strong>Pontuação: {scores.depressao || 0}</strong> (Nível Sugerido: {getDepressionLevel(scores.depressao || 0)})</p>
            </div>
            <div className="results">
              <h3>Sintomas de Ansiedade (GAD-7)</h3>
              <p><strong>Pontuação: {scores.ansiedade || 0}</strong> (Nível Sugerido: {getAnxietyLevel(scores.ansiedade || 0)})</p>
            </div>

            <div className="score-explanation">
              <h4>O que são essas escalas?</h4>
              <p><strong>PHQ-9 (Patient Health Questionnaire-9):</strong> É uma ferramenta de rastreio mundialmente utilizada para avaliar a presença e a severidade de sintomas depressivos.</p>
              <p><strong>GAD-7 (General Anxiety Disorder-7):</strong> É uma ferramenta de rastreio para avaliar a presença e severidade de sintomas de ansiedade generalizada.</p>
              <h4>Próximos Passos</h4>
              <p>Independentemente do resultado, se você tem se sentido diferente, conversar com um profissional de saúde mental é sempre o passo mais recomendado. <Link to="/busque-ajuda">Clique aqui para ver recursos de ajuda.</Link></p>
            </div>
          </div>
        ) : (
          <>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>

            <div className="question-instructions">
              <p><strong>Nas últimas 2 semanas</strong>, com que frequência o seguinte problema o(a) incomodou?</p>
            </div>

            <div className="question-section fade-in" key={currentSectionIndex + '-' + currentQuestionIndex}>
              <div className="question-count">
              </div>
              <div className="question-text">
                <h2>{currentQuestion.questionText}</h2>
              </div>
              <div className="answer-section">
                {answerOptions.map((answerOption, index) => (
                  <button key={index} onClick={() => handleAnswerButtonClick(answerOption.score)}>
                    {answerOption.answerText}
                  </button>
                ))}
              </div>
              <div className="navigation-buttons">
                <button onClick={handleBackButtonClick} disabled={history.length === 0} className="cta-button">
                  Voltar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Questionario;