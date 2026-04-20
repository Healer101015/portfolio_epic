import { useEffect, useState } from 'react';
import ThreeBackground from './components/ThreeBackground';

export default function App() {
  const [currentStation, setCurrentStation] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const spacer = document.getElementById('scroll-spacer');
      if (!spacer) return;
      const maxScroll = spacer.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      setCurrentStation(Math.round(progress * 3));
    };

    window.addEventListener('scroll', handleScroll);

    // Ocultar o loader após o carregamento inicial (como no original)
    setTimeout(() => setLoading(false), 1200);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStation = (index: number) => {
    const spacer = document.getElementById('scroll-spacer');
    if (!spacer) return;
    const maxScroll = spacer.offsetHeight - window.innerHeight;
    const scrollTo = (index / 3) * maxScroll;
    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
  };

  return (
    <>
      {/* LOADER */}
      <div id="loader" className={loading ? '' : 'hidden'}>
        <div className="loader-circle"></div>
        <div className="loader-text">Preparing portfolio</div>
      </div>

      {/* PAPER TEXTURE */}
      <div id="paper-overlay"></div>

      {/* THREE.JS CANVAS */}
      <ThreeBackground />

      {/* NAVIGATION DOTS */}
      <div id="nav-dots">
        {['Intro', 'Philosophy', 'Process', 'Contact'].map((label, i) => (
          <div
            key={i}
            className={`nav-dot ${currentStation === i ? 'active' : ''}`}
            data-label={label}
            onClick={() => scrollToStation(i)}
          ></div>
        ))}
      </div>

      {/* CONTENT OVERLAY */}
      <div id="content-layer">

        {/* STATION 0: INTRO */}
        <div className={`station station-intro ${currentStation === 0 ? 'active' : ''}`}>
          <div>
            <h1>Code<br />as <em>Language</em></h1>
            <div className="subtitle">João Henrique Brito · Full Stack Developer</div>
          </div>
          <div className="scroll-hint">
            <span>Scroll</span>
            <div className="line"></div>
          </div>
        </div>

        {/* STATION 1: PHILOSOPHY */}
        <div className={`station station-philosophy ${currentStation === 1 ? 'active' : ''}`}>
          <div className="philosophy-content">
            <span className="label">Philosophy</span>
            <h2>Systems that belong<br />to the user</h2>
            <p>I design architectures that speak the dialect of modern web — robust back-ends that handle data with precision, interactive front-ends that feel alive, and clean code that ensures scalability.</p>
            <p>Every line I write begins with a purpose. From the database to the interface, the web has its own vocabulary, and the best applications are the ones that already feel like they've always been there.</p>
            <div className="tags">
              <span className="tag">React & TS</span>
              <span className="tag">Node.js</span>
              <span className="tag">NestJS</span>
              <span className="tag">Full Stack</span>
            </div>
          </div>
        </div>

        {/* STATION 2: PROJECTS */}
        <div className={`station station-process ${currentStation === 2 ? 'active' : ''}`}>
          <div className="process-content">
            <span className="label">Selected Works</span>
            <h2>From logic<br />to production</h2>
            <div className="process-steps">
              <div className="process-step">
                <span className="step-num">1</span>
                <div className="step-text">
                  <h3>React Builder Pro</h3>
                  <p>A visual drag-and-drop website builder designed to seamlessly export production-ready React and Vite code.</p>
                </div>
              </div>
              <div className="process-step">
                <span className="step-num">2</span>
                <div className="step-text">
                  <h3>RPG Internet Banking</h3>
                  <p>A comprehensive banking application featuring secure authentication, exact transaction atomicity, and a medieval RPG aesthetic.</p>
                </div>
              </div>
              <div className="process-step">
                <span className="step-num">3</span>
                <div className="step-text">
                  <h3>Doodle Tasks</h3>
                  <p>A task management system tightly integrated with a personalized avatar generation library and MongoDB persistence.</p>
                </div>
              </div>
            </div>
            <p className="partner-note">I focus on the vision and the robust code beneath. You get an application that's both deeply considered and expertly built.</p>
          </div>
        </div>

        {/* STATION 3: CONTACT */}
        <div className={`station station-contact ${currentStation === 3 ? 'active' : ''}`}>
          <div className="label">Get In Touch</div>
          <h2>Let's build<br />your <em>vision</em></h2>
          <div className="areas">Available for challenging projects</div>
          <div>
            <a href="https://github.com/seu-usuario" target="_blank" rel="noreferrer" className="phone-link">GitHub</a>
            <a href="https://linkedin.com/in/seu-usuario" target="_blank" rel="noreferrer" className="phone-link">LinkedIn</a>
          </div>
          <p className="footnote">Crafting interactive, cinematic user experiences backed by reliable engineering.</p>
        </div>

      </div>

      {/* SCROLL SPACER */}
      <div id="scroll-spacer"></div>
    </>
  );
}