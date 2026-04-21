import { useEffect, useState } from 'react';
import ThreeBackground from './components/ThreeBackground';
import CurriculoPDF from './assets/Joao_Brito.pdf';
// Certifique-se de colocar o seu PDF dentro da pasta src/assets/


export default function App() {
  const [currentStation, setCurrentStation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [introVisible, setIntroVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, window.scrollY / (maxScroll || 1)));
      setCurrentStation(Math.round(progress * 3));
    };

    window.addEventListener('scroll', handleScroll);

    setTimeout(() => {
      setLoading(false);
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
        <div className="loader-text">Inicializando Sistema</div>
      </div>

      {/* PAPER TEXTURE */}
      <div id="paper-overlay"></div>

      {/* THREE.JS CANVAS */}
      <ThreeBackground />

      {/* NAVIGATION DOTS */}
      <div id="nav-dots">
        {['Início', 'Trajetória', 'Projetos', 'Contato'].map((label, i) => (
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
            <div className="intro-eyebrow">Desenvolvedor Full Stack · Multiplataforma</div>
            <h1>
              Código<br />
              como <em>Linguagem</em>
            </h1>
            <div className="intro-divider" />
            <div className="intro-meta">
              <span className="intro-name">João Henrique Brito</span>
              <span className="intro-sep">·</span>
              <span className="intro-role">React · Node.js · Java</span>
            </div>
            <div className="intro-description">
              Construo sistemas que falam a linguagem da web moderna — do banco de dados à interface, com precisão, escalabilidade e intenção.
            </div>
            <div className="intro-actions">
              <button className="intro-btn" onClick={() => scrollToStation(2)}>
                Ver Projetos
              </button>
              {/* Para o currículo funcionar, descomente a importação no topo e use href={CurriculoPDF} */}
              <a href={CurriculoPDF} download="Joao_Brito_CV.pdf" className="intro-btn intro-btn--ghost" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Baixar CV
              </a>
            </div>
          </div>
          <div className={`scroll-hint ${introVisible ? 'scroll-hint-animate' : ''}`}>
            <span>Role</span>
            <div className="line"></div>
          </div>
        </div>

        {/* STATION 1: TRAJETÓRIA & EXPERTISE */}
        <div className={`station station-philosophy ${currentStation === 1 ? 'active' : ''}`}>
          <div className="philosophy-content">
            <span className="label">Trajetória Acadêmica & Base</span>
            <h2>Arquitetura de<br /><em>Conhecimento</em></h2>

            <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1A1714' }}>FATEC Itaquera</h3>
              <p style={{ margin: 0, fontSize: '1rem', opacity: 0.8 }}>Análise e Desenvolvimento de Software</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ borderLeft: '2px solid rgba(26, 23, 20, 0.2)', paddingLeft: '1rem' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>Programador Multiplataforma Mobile</strong>
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Desenvolvimento em C, Java e Kotlin</span>
              </div>
              <div style={{ borderLeft: '2px solid rgba(26, 23, 20, 0.2)', paddingLeft: '1rem' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>Bootcamp Generation</strong>
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Imersão hardcore em JS e metodologias ágeis de mercado.</span>
              </div>
            </div>

            <span className="label" style={{ fontSize: '0.7rem', marginBottom: '1rem', display: 'block' }}>Licenças & Certificações Globais</span>
            <div className="tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="tag">AWS Cloud Foundations</span>
              <span className="tag">Google Cloud Computing</span>
              <span className="tag">Google Secure Cloud Network</span>
              <span className="tag">SENAI - Lógica de Programação</span>
              <span className="tag">Desenvolvedor Back-End (FATEC)</span>
              <span className="tag">Desenvolvedor Front-End (FATEC)</span>
            </div>
          </div>
        </div>

        {/* STATION 2: PROJECTS */}
        <div className={`station station-process ${currentStation === 2 ? 'active' : ''}`}>
          <div className="process-content">
            <span className="label">Obras Selecionadas</span>
            <h2>Da lógica<br />para <em>produção</em></h2>
            <div className="process-steps">
              <div className="process-step">
                <span className="step-num">1</span>
                <div className="step-text">
                  <h3>Internet Banking Medieval</h3>
                  <p>Arquitetura financeira completa com Node.js e MySQL, transações via Pix e interface React com estética de fantasia medieval.</p>
                </div>
              </div>
              <div className="process-step">
                <span className="step-num">2</span>
                <div className="step-text">
                  <h3>React Builder Pro</h3>
                  <p>Construtor No-Code avançado em TypeScript e Dnd-kit, focado em manipulação severa de DOM e estado.</p>
                </div>
              </div>
              <div className="process-step">
                <span className="step-num">3</span>
                <div className="step-text">
                  <h3>Eco da Sinfonia</h3>
                  <p>Storytelling imersivo estruturado em atos utilizando React e Three.js para uma narrativa visual envolvente.</p>
                </div>
              </div>
              <div className="process-step">
                <span className="step-num">4</span>
                <div className="step-text">
                  <h3>Controle de Estoque</h3>
                  <p>Plataforma de gestão de inventário e fluxo para cafeterias, construída com Java, Node.js e MongoDB.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATION 3: CONTACT */}
        <div className={`station station-contact ${currentStation === 3 ? 'active' : ''}`}>
          <div className="label">Contato</div>
          <h2>Vamos construir<br />sua <em>visão</em></h2>
          <div className="areas">Disponível para projetos desafiadores</div>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
            <a href="https://github.com/Healer101015" target="_blank" rel="noreferrer" className="phone-link" style={{ fontSize: '1.2rem', textDecoration: 'none' }}>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/jo%C3%A3o-henrique-brito-b583b61a2/" target="_blank" rel="noreferrer" className="phone-link" style={{ fontSize: '1.2rem', textDecoration: 'none' }}>
              LinkedIn
            </a>
          </div>
          <p className="footnote" style={{ marginTop: '4rem' }}>
            © {new Date().getFullYear()} João Henrique Brito.<br />
            Criando experiências interativas sustentadas por engenharia confiável.
          </p>
        </div>

      </div>

      {/* SCROLL SPACER */}
      <div id="scroll-spacer"></div>
    </>
  );
}