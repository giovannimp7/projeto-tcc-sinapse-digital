import React from 'react';

function BusqueAjuda() {
  return (
    <div className="page-content fade-in">
      <div className="container">
        <h1>Onde Encontrar Ajuda</h1>
        <hr />

        <div style={{textAlign: 'center', margin: '40px 0'}}>
            <img 
              src="/imagens/mao-estendida.jpg" 
              alt="Mãos estendidas em sinal de apoio" 
              style={{maxWidth: '500px', width: '100%', borderRadius: '8px'}} 
            />
        </div>

        <section className="project-section">
          <h2>O Passo Mais Corajoso</h2>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;Reconhecer que precisamos de ajuda e tomar a decisão de buscá-la é um dos atos mais significativos de autocuidado. Essa jornada pode parecer desafiadora, mas você não precisa percorrê-la sozinho(a). Existem diversos caminhos e recursos confiáveis disponíveis. Esta página serve como um guia inicial para te orientar.
          </p>
        </section>

        <section className="project-section">
          <h2>Para Crises e Suporte Imediato</h2>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;Se você está passando por uma crise, sentindo uma angústia intensa ou precisa de uma conversa imediata, estes serviços são gratuitos, sigilosos e estão disponíveis a qualquer momento:
          </p>
          <ul>
            <li>
              <strong>CVV (Centro de Valorização da Vida):</strong> Focado na prevenção do suicídio, oferece apoio emocional por telefone, chat ou e-mail. Voluntários treinados estão disponíveis para conversar 24 horas por dia.
              <br />
              <strong>Telefone:</strong> 188 (ligação gratuita de qualquer telefone)
              <br />
              <strong>Site (para chat e e-mail):</strong> <a href="https://www.cvv.org.br" target="_blank" rel="noopener noreferrer">www.cvv.org.br</a>
            </li>
            <li><strong>SAMU (192):</strong> Em caso de emergências de saúde, incluindo crises psiquiátricas graves, o SAMU deve ser acionado.</li>
          </ul>
        </section>
        
        <section className="project-section">
          <h2>Atendimento Público e Acessível (SUS)</h2>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;O Sistema Único de Saúde (SUS) oferece uma rede de cuidados em saúde mental, a RAPS (Rede de Atenção Psicossocial). A porta de entrada principal são os:
          </p>
          <ul>
            <li>
              <strong>CAPS (Centros de Atenção Psicossocial):</strong> Unidades especializadas que oferecem atendimento multiprofissional (com psicólogos, psiquiatras, assistentes sociais, etc.) para casos de transtornos mentais moderados a graves. Procure o CAPS de referência da sua cidade ou bairro.
            </li>
            <li>
              <strong>UBS (Unidades Básicas de Saúde / Postos de Saúde):</strong> Muitas equipes de saúde da família estão preparadas para o primeiro acolhimento e podem encaminhar para serviços especializados.
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}

export default BusqueAjuda;