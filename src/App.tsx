import { useEffect, useRef, useState } from 'react';
import ThreeBackground from './components/ThreeBackground';

export default function App() {
  const [currentStation, setCurrentStation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [introVisible, setIntroVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      setCurrentStation(Math.round(progress * 3));
    };

    window.addEventListener('scroll', handleScroll);

    // After loader hides, trigger intro animations
    setTimeout(() => {
      setLoading(false);
      // Small delay to let CSS transition complete before triggering child animations
      setTimeout(() => setIntroVisible(true), 100);
    }, 1200);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStation = (index: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (index / 3) * maxScroll, behavior: 'smooth' });
  };

  return (
    <>
      {/* LOADER */}
      <div id="loader" className={loading ? '' : 'hidden'}>
        <div className="loader-circle"></div>
        <div className="loader-text">Preparando portfólio</div>
      </div>

      {/* PAPER TEXTURE */}
      <div id="paper-overlay"></div>

      {/* THREE.JS CANVAS */}
      <ThreeBackground />

      {/* NAVIGATION DOTS */}
      <div id="nav-dots">
        {['Início', 'Filosofia', 'Projetos', 'Contato'].map((label, i) => (
          <div
            key={i}
            className={`nav-dot ${currentStation === i ? 'active' : ''}`}
            data-label={label}
            onClick={() => scrollToStation(i)}
          />
        ))}
      </div>

      {/* CONTENT OVERLAY */}
      <div id="content-layer">

        {/* STATION 0: INTRO */}
        <div className={`station station-intro ${currentStation === 0 ? 'active' : ''}`}>
          <div className={`intro-wrapper ${introVisible ? 'intro-animate' : ''}`}>
            <div className="intro-eyebrow">Portfólio · Desenvolvedor Full Stack</div>
            <h1>
              Código<br />
              como <em>Linguagem</em>
            </h1>
            <div className="intro-divider" />
            <div className="intro-meta">
              <span className="intro-name">João Henrique Brito</span>
              <span className="intro-sep">·</span>
              <span className="intro-role">React · Node.js · NestJS</span>
            </div>
            <div className="intro-description">
              Construo sistemas que falam a linguagem da web moderna — do banco de dados à interface, com precisão e intenção.
            </div>
            <div className="intro-actions">
              <button className="intro-btn" onClick={() => scrollToStation(1)}>
                Ver trabalhos
              </button>
              <button className="intro-btn intro-btn--ghost" onClick={() => scrollToStation(3)}>
                Entrar em contato
              </button>
            </div>
          </div>
          <div className={`scroll-hint ${introVisible ? 'scroll-hint-animate' : ''}`}>
            <span>Role</span>
            <div className="line"></div>
          </div>
        </div>

        {/* STATION 1: PHILOSOPHY */}
        <div className={`station station-philosophy ${currentStation === 1 ? 'active' : ''}`}>
          <div className="philosophy-content">
            <span className="label">Filosofia</span>
            <h2>Sistemas que pertencem<br />ao usuário</h2>
            <p>Projeto arquiteturas que falam o dialeto da web moderna — back-ends robustos que tratam dados com precisão, front-ends interativos que se sentem vivos, e código limpo que garante escalabilidade.</p>
            <p>Cada linha que escrevo começa com um propósito. Do banco de dados à interface, a web tem seu próprio vocabulário, e as melhores aplicações são aquelas que já parecem ter sempre existido.</p>
            <div className="tags">
              <span className="tag">React & TypeScript</span>
              <span className="tag">Node.js</span>
              <span className="tag">NestJS</span>
              <span className="tag">Full Stack</span>
            </div>
          </div>
        </div>

        {/* STATION 2: PROJECTS */}
        <div className={`station station-process ${currentStation === 2 ? 'active' : ''}`}>
          <div className="process-content">
            <span className="label">Trabalhos Selecionados</span>
            <h2>Da lógica<br />para produção</h2>
            <div className="process-steps">
              <div className="process-step">
                <span className="step-num">1</span>
                <div className="step-text">
                  <h3>React Builder Pro</h3>
                  <p>Construtor visual drag-and-drop para criar sites que exporta código React e Vite pronto para produção.</p>
                </div>
              </div>
              <div className="process-step">
                <span className="step-num">2</span>
                <div className="step-text">
                  <h3>RPG Internet Banking</h3>
                  <p>Aplicação bancária completa com autenticação segura, atomicidade exata nas transações e estética de RPG medieval.</p>
                </div>
              </div>
              <div className="process-step">
                <span className="step-num">3</span>
                <div className="step-text">
                  <h3>Doodle Tasks</h3>
                  <p>Sistema de gerenciamento de tarefas integrado com geração personalizada de avatares e persistência em MongoDB.</p>
                </div>
              </div>
            </div>
            <p className="partner-note">Foco na visão e no código robusto por baixo. Você recebe uma aplicação profunda e tecnicamente refinada.</p>
          </div>
        </div>

        {/* STATION 3: CONTACT */}
        <div className={`station station-contact ${currentStation === 3 ? 'active' : ''}`}>
          <div className="label">Contato</div>
          <h2>Vamos construir<br />sua <em>visão</em></h2>
          <div className="areas">Disponível para projetos desafiadores</div>
          <div>
            <a href="https://github.com/seu-usuario" target="_blank" rel="noreferrer" className="phone-link">GitHub</a>
            <a href="https://linkedin.com/in/seu-usuario" target="_blank" rel="noreferrer" className="phone-link">LinkedIn</a>
          </div>
          <p className="footnote">Criando experiências interativas e cinematográficas sustentadas por engenharia confiável.</p>
        </div>

      </div>

      {/* SCROLL SPACER */}
      <div id="scroll-spacer"></div>
    </>
  );
}