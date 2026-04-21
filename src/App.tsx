import { useEffect, useState } from 'react';
import ThreeBackground from './components/ThreeBackground';
import CurriculoPDF from './assets/Joao_Brito.pdf';
import { useGithubRepos } from './assets/hooks/useGithubRepos'; // Importação do seu novo Hook

export default function App() {
  const [currentStation, setCurrentStation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [introVisible, setIntroVisible] = useState(false);

  // Inicialização do Hook com a sua conta do GitHub
  const { repos, loading: reposLoading } = useGithubRepos('Healer101015');

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
        <div className={`station station-intro ${currentStation === 0 ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Estilos injetados especificamente para as novas animações desta seção */}
          <style>
            {`
              @keyframes pulse-green {
                0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
              }
              @keyframes spin-slow {
                100% { transform: rotate(360deg); }
              }
              @keyframes scroll-bounce {
                0%, 100% { transform: translateY(0); opacity: 1; }
                50% { transform: translateY(6px); opacity: 0.3; }
              }
              .intro-layout {
                display: flex;
                flex-direction: column-reverse;
                align-items: center;
                gap: 3rem;
              }
              @media (min-width: 900px) {
                .intro-layout {
                  flex-direction: row;
                  justify-content: space-between;
                }
              }
            `}
          </style>

          <div
            className={`intro-wrapper ${introVisible ? 'intro-animate' : ''} intro-layout`}
            style={{
              maxWidth: '1100px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.02)', // Melhoria 2: Glassmorphism
              backdropFilter: 'blur(12px)',
              padding: '3.5rem',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Lado Esquerdo: Textos e Botões */}
            <div style={{ flex: '1 1 60%' }}>

              {/* Melhoria 1: Status Badge Pulsante */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse-green 2s infinite' }}></div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' }}>
                  Disponível para Projetos
                </span>
              </div>

              <div className="intro-eyebrow">Desenvolvedor Full Stack · Multiplataforma</div>
              <h1 style={{ marginBottom: '1rem' }}>
                Código<br />
                como <em>Linguagem</em>
              </h1>
              <div className="intro-divider" style={{ margin: '1.5rem 0' }} />
              <div className="intro-meta">
                <span className="intro-name">João Henrique Brito</span>
                <span className="intro-sep">·</span>
                <span className="intro-role">React · Node.js · Java</span>
              </div>
              <div className="intro-description" style={{ marginBottom: '2.5rem' }}>
                Construo sistemas que falam a linguagem da web moderna — do banco de dados à interface, com precisão, escalabilidade e intenção.
              </div>

              {/* Botões Principais */}
              <div className="intro-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', alignItems: 'center' }}>
                <button className="intro-btn" onClick={() => scrollToStation(2)}>
                  Ver Projetos
                </button>
                <a href={CurriculoPDF} download="Joao_Brito_CV.pdf" className="intro-btn intro-btn--ghost" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Baixar CV
                </a>
              </div>

              {/* Melhoria 4: Quick Links Sociais */}
              <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <a href="https://github.com/Healer101015" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
                  GitHub <span style={{ opacity: 0.5 }}>↗</span>
                </a>
                <a href="https://www.linkedin.com/in/jo%C3%A3o-henrique-brito-b583b61a2/" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
                  LinkedIn <span style={{ opacity: 0.5 }}>↗</span>
                </a>
              </div>
            </div>

            {/* Melhoria 3: Avatar com Anel High-Tech */}
            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '220px', height: '220px', borderRadius: '50%', padding: '4px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.8), transparent, rgba(255, 255, 255, 0.2))', animation: 'spin-slow 8s linear infinite', boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#1A1714', padding: '4px', animation: 'spin-slow 8s linear infinite reverse' }}>
                  {/* Substitua 'image_745cc7.jpg' pelo caminho real da sua foto dentro de src/assets/ ou public/ */}
                  <img
                    src="/image_745cc7.jpg"
                    alt="João Brito"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', filter: 'contrast(1.1) saturate(1.1)' }}
                    onError={(e) => { e.currentTarget.src = 'https://avatars.githubusercontent.com/u/107642855?v=4' }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Melhoria 5: Scroll Hint Moderno (Mouse animado) */}
          <div className={`scroll-hint ${introVisible ? 'scroll-hint-animate' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'absolute', bottom: '5vh' }}>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.4, color: '#fff' }}>
              Explorar
            </span>
            <div style={{ width: '22px', height: '36px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', display: 'flex', justifyContent: 'center', padding: '6px' }}>
              <div style={{ width: '4px', height: '6px', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '2px', animation: 'scroll-bounce 1.5s ease-in-out infinite' }}></div>
            </div>
          </div>
        </div>
        {/* STATION 1: TRAJETÓRIA & EXPERTISE */}
        <div className={`station station-philosophy ${currentStation === 1 ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 2rem' }}>

          <style>
            {`
              .timeline-item {
                position: relative;
                padding-left: 2rem;
                padding-bottom: 1.5rem;
                transition: transform 0.3s ease;
                border-left: 2px solid rgba(26, 23, 20, 0.1);
              }
              .timeline-item:last-child {
                border-left-color: transparent;
              }
              .timeline-item::before {
                content: '';
                position: absolute;
                left: -6px;
                top: 4px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #1A1714;
                box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.8);
                transition: all 0.3s ease;
              }
              .timeline-item:hover {
                transform: translateX(5px);
              }
              .timeline-item:hover::before {
                background: #10B981; /* Verde tech no hover */
                box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
              }
              .cert-tag {
                font-size: 0.75rem;
                font-family: var(--mono, monospace);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                padding: 0.4rem 1rem;
                background: rgba(26, 23, 20, 0.03);
                border: 1px solid rgba(26, 23, 20, 0.1);
                border-radius: 20px;
                color: #1A1714;
                transition: all 0.3s ease;
                cursor: default;
              }
              .cert-tag:hover {
                background: rgba(26, 23, 20, 0.08);
                border-color: rgba(26, 23, 20, 0.3);
                transform: translateY(-2px);
              }
            `}
          </style>

          <div
            className="philosophy-content"
            style={{
              maxWidth: '900px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(12px)',
              padding: '3.5rem',
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
            }}
          >
            <span className="label" style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26, 23, 20, 0.5)', marginBottom: '12px', display: 'block' }}>
              Trajetória Acadêmica & Base
            </span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#1A1714', marginBottom: '3rem' }}>
              Arquitetura de<br /><em>Conhecimento</em>
            </h2>

            {/* Formação Principal */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(26, 23, 20, 0.1)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#1A1714', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                🎓
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#1A1714', marginBottom: '0.3rem', fontFamily: 'var(--display)' }}>
                  FATEC Itaquera
                </h3>
                <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(26, 23, 20, 0.7)', lineHeight: 1.5 }}>
                  Análise e Desenvolvimento de Software
                </p>
              </div>
            </div>

            {/* Linha do Tempo (Bootcamps & Especializações) */}
            <div style={{ marginBottom: '3.5rem', paddingLeft: '0.5rem' }}>
              <div className="timeline-item">
                <strong style={{ display: 'block', fontSize: '1.1rem', color: '#1A1714', marginBottom: '0.2rem' }}>Programador Multiplataforma Mobile</strong>
                <span style={{ fontSize: '0.9rem', color: 'rgba(26, 23, 20, 0.6)' }}>Desenvolvimento nativo e híbrido focado em C, Java e Kotlin.</span>
              </div>
              <div className="timeline-item">
                <strong style={{ display: 'block', fontSize: '1.1rem', color: '#1A1714', marginBottom: '0.2rem' }}>Bootcamp Generation Brasil</strong>
                <span style={{ fontSize: '0.9rem', color: 'rgba(26, 23, 20, 0.6)' }}>Imersão intensiva em JavaScript e metodologias ágeis (Scrum/Kanban) simulando o mercado real.</span>
              </div>
            </div>

            {/* Certificações Globais */}
            <div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26, 23, 20, 0.5)', display: 'block', marginBottom: '1.2rem' }}>
                Licenças & Certificações Globais
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                <span className="cert-tag">AWS Cloud Foundations</span>
                <span className="cert-tag">Google Cloud Computing</span>
                <span className="cert-tag">Google Secure Cloud Network</span>
                <span className="cert-tag">SENAI - Lógica de Programação</span>
                <span className="cert-tag">Dev Front-End (FATEC)</span>
                <span className="cert-tag">Dev Back-End (FATEC)</span>
              </div>
            </div>

          </div>
        </div>

        {/* STATION 2: PROJECTS (LADO A LADO E CENTRALIZADO) */}
        <div className={`station station-process ${currentStation === 2 ? 'active' : ''}`}>
          <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>

            {/* Título Centralizado */}
            <div style={{ textAlign: 'center', marginBottom: '2rem', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '12px', display: 'block' }}>
                Inspirações & Favoritos
              </span>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                Da lógica<br />para <em>produção</em>
              </h2>
            </div>

            {/* Grid Responsivo com Scroll Interno (Garante que o 4º item nunca seja cortado) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', width: '100%', overflowY: 'auto', maxHeight: '65vh', padding: '1rem 0' }}>
              {reposLoading ? (
                <div style={{ padding: '2rem 0', opacity: 0.6, fontStyle: 'italic', textAlign: 'center', gridColumn: '1 / -1' }}>
                  Sincronizando registos visuais...
                </div>
              ) : (
                repos.map((repo, index) => (
                  <div key={repo.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>

                    {/* Imagem do Projeto */}
                    <div style={{ width: '100%', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', flexShrink: 0 }}>
                      <img
                        src={repo.imageUrl}
                        alt={repo.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                      />
                    </div>

                    {/* Texto e Informação */}
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem' }}>
                        <span style={{ fontFamily: 'var(--display)', fontSize: '18px', fontWeight: 400, color: 'var(--ink-ghost)', fontStyle: 'italic' }}>
                          0{index + 1}
                        </span>
                        <h3 style={{ textTransform: 'capitalize', fontSize: '1.1rem', color: '#1A1714', margin: 0, fontFamily: 'var(--display)', fontWeight: 600 }}>
                          {repo.name}
                        </h3>
                      </div>

                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, color: '#1A1714', marginBottom: '0.6rem', fontFamily: 'var(--mono)' }}>
                        Autor: {repo.owner.login}
                      </span>

                      <p style={{ fontSize: '0.85rem', lineHeight: '1.5', opacity: 0.8, color: '#1A1714', flexGrow: 1, fontFamily: 'var(--serif)' }}>
                        {repo.description}
                      </p>

                      {/* Links de Ação */}
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
                        <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '2px solid rgba(26, 23, 20, 0.3)', textDecoration: 'none', color: '#1A1714', fontFamily: 'var(--mono)' }}>
                          Source
                        </a>
                        {repo.homepage && (
                          <a href={repo.homepage} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '2px solid rgba(26, 23, 20, 0.3)', textDecoration: 'none', color: '#1A1714', fontFamily: 'var(--mono)' }}>
                            Demo
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              )}
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