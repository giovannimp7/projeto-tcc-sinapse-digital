import React from 'react';
import { Link } from 'react-router-dom';

function OProjeto() {
  return (
    <div className="page-content fade-in">
      <div className="container">
        <h1>O Projeto Sinapse Digital</h1>
        <hr />

        <section className="project-section">
          <h2>Introdução: O Paradoxo da Conectividade</h2>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;Vivemos na era da informação, onde a tecnologia nos conecta de formas sem precedentes. No entanto, essa mesma era digital trouxe consigo novos desafios para a saúde mental. O Sinapse Digital nasce neste contexto, como uma iniciativa acadêmica que busca explorar como a tecnologia, quando aplicada de forma ética e responsável, pode se tornar uma poderosa aliada na promoção do bem-estar psíquico.
          </p>
        </section>

        <section className="project-section">
          <h2>O Problema: Barreiras ao Cuidado</h2>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;A saúde mental é um desafio de saúde pública global. No Brasil, o acesso a serviços especializados é frequentemente limitado por barreiras geográficas, financeiras e, principalmente, pelo profundo estigma social que ainda envolve os transtornos psíquicos. Para dimensionar o cenário local, o "Estudo Epidemiológico de Transtornos Mentais São Paulo Megacity" revela dados alarmantes: a prevalência de pelo menos um transtorno mental ao longo da vida atinge 44,8% da população paulistana.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;Os transtornos de ansiedade são a classe mais comum, afetando 28,1% dos indivíduos, sendo os mais prevalentes o Transtorno de Ansiedade Generalizada (TAG), Transtorno de Pânico e Fobia Social. Em seguida, aparecem os transtornos de humor (19,1%) e os transtornos por uso de substâncias (11,0%). O estudo também aponta para a complexidade do quadro, com 23,2% dos entrevistados apresentando dois ou mais transtornos e 13,4% com três ou mais comorbidades ao longo da vida. Este cenário resulta em diagnósticos tardios e tratamentos inadequados, perpetuando um ciclo de sofrimento e sublinhando a urgência por soluções de triagem na atenção primária.
          </p>
        </section>
        

        <section className="project-section">
          <h2>Nossa Solução: Tecnologia como Ponto de Partida</h2>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;O Sinapse Digital propõe uma plataforma de pré-triagem e acolhimento que visa diminuir a distância entre o indivíduo e o cuidado profissional. Nossa solução se baseia em dois pilares:
          </p>
          <ul>
            <li>
              <strong>Anamnese Digital Estruturada:</strong> Oferecemos um questionário anônimo e interativo, fundamentado em escalas de rastreio consolidadas mundialmente. Utilizamos o <strong>PHQ-9 (Patient Health Questionnaire-9)</strong> para avaliar a severidade de sintomas depressivos e o <strong>GAD-7 (General Anxiety Disorder-7)</strong> para sintomas de ansiedade. O objetivo não é diagnosticar, mas sim fornecer ao usuário um feedback quantitativo e educacional, incentivando a auto-observação.
            </li>
            <li>
              <strong>Acolhimento com Inteligência Artificial:</strong> Através da "Serena", nossa assistente de IA, oferecemos um espaço de escuta empática, disponível 24/7. Serena é treinada para acolher, validar sentimentos e, crucialmente, guiar o usuário sobre a importância de procurar um profissional qualificado, agindo como uma ponte segura para o cuidado terapêutico.
            </li>
          </ul>
        </section>
        
        <section className="project-section">
          <h2>Tecnologia com Responsabilidade</h2>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;É fundamental ressaltar que o Sinapse Digital é uma ferramenta pré-clínica e de psicoeducação. Em nenhum momento ela substitui a avaliação, o diagnóstico ou o tratamento realizado por um psicólogo ou médico psiquiatra. Nosso compromisso é com a ética e a segurança do usuário, utilizando a tecnologia para empoderar o indivíduo com informação e encorajá-lo a dar o passo mais importante: <Link to="/busque-ajuda">buscar ajuda profissional</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}

export default OProjeto;