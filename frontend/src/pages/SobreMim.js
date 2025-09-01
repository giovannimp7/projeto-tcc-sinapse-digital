import React from 'react';

function SobreMim() {
  return (
    <div className="page-content fade-in">
      <div className="container">

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <img 
            src="/imagens/profile/profile-pic.png" 
            alt="Foto de Giovanni Marques Pereira" 
            style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px' }} 
          />
          <h1>Sobre o Autor</h1>
        </div>
        <hr />

        <section className="project-section">
          <h2>Giovanni Marques Pereira</h2>
          <h3>Graduando em Engenharia de Computação (IFSP)</h3>
          <br/>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;Seja bem-vindo(a) ao Sinapse Digital. Meu nome é Giovanni, e este projeto é a culminação de anos de estudo, noites de codificação e, acima de tudo, de uma profunda crença de que a tecnologia pode e deve servir como uma força para o bem-estar humano.
          </p>
          <hr></hr>
          <h3>A Motivação</h3>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;A ideia para o Sinapse Digital nasceu de observações e conversas com amigos e familiares. Percebi um padrão: muitas pessoas sentem que algo não vai bem, mas o primeiro passo para buscar ajuda parece um abismo. O estigma, a incerteza sobre "o que eu tenho" ou o simples fato de não saber por onde começar criam barreiras que podem durar anos. Como estudante de tecnologia, me senti compelido a usar minhas ferramentas para tentar construir uma ponte sobre esse abismo.
          </p>
          <hr></hr>
          <h3>A Visão</h3>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;Minha visão não é substituir o cuidado humano, mas sim catalisá-lo. O questionário e a Serena são portas de entrada: ferramentas de autoconhecimento e acolhimento desenhadas para serem seguras, anônimas e livres de julgamento. Eles existem para que a primeira conversa sobre saúde mental possa ser consigo mesmo, no seu tempo e espaço.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;Este TCC é mais do que um requisito acadêmico, é o meu "Olá, mundo!" para uma área onde a engenharia encontra a empatia. Agradeço imensamente a você por usar esta plataforma e fazer parte desta jornada.
          </p>
        </section>

      </div>
    </div>
  );
}

export default SobreMim;