import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEOHead from '../../components/shared/SEOHead';
import useScrollReveal from '../../hooks/useScrollReveal';
import AntigravityBackground from '../../components/ui/AntigravityBackground';

const features = [
  { icon: '⚡', title: 'Live Preview', desc: 'See your README rendered in real-time as you type. GitHub-accurate preview with badge rendering.' },
  { icon: '🎨', title: '8 Smart Templates', desc: 'Start fast with templates for Web Apps, ML projects, APIs, CLIs, Mobile Apps, and more.' },
  { icon: '🛠️', title: '32 Tech Chips', desc: 'One-click technology selection. Auto-organizes your stack into Frontend, Backend, Database, and DevOps layers.' },
  { icon: '📊', title: 'Quality Score', desc: 'Built-in README quality analyzer gives you a score out of 100 with actionable improvement tips.' },
  { icon: '📁', title: 'Structure Visualizer', desc: 'Paste your folder structure and get a beautiful tree diagram with emoji icons automatically.' },
  { icon: '📥', title: 'Export Options', desc: 'Copy to clipboard, download as README.md, or print to PDF — all in one click.' },
  { icon: '💾', title: 'Auto-Save', desc: 'Your work is automatically saved to localStorage. Pick up exactly where you left off.' },
  { icon: '🌙', title: 'Dark & Light Mode', desc: 'Full dark and light theme support with smooth transitions and system preference detection.' },
];

const stats = [
  { value: '8+', label: 'Templates' },
  { value: '32', label: 'Tech Chips' },
  { value: '12', label: 'Sections' },
  { value: '100', label: 'Quality Score' },
];

export default function LandingPage() {
  const revealRef = useScrollReveal();
  const { scrollY } = useScroll();
  
  // Parallax transforms mapped to scroll position
  const yAsterisk = useTransform(scrollY, [0, 1000], [0, 300]);
  const yPills = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <>
      <SEOHead
        title="READMEForge — Generate Professional GitHub READMEs in 30 Seconds"
        description="Free, open-source README generator. Live preview, 8 templates, quality scoring, and one-click export. No sign-up required."
      />
      <div ref={revealRef} className="page-transition">

      <div className="hero-wrapper" style={{ paddingTop: 64 }}>
        <AntigravityBackground />

        <main className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            GitHub<br />Readme.Md<br />maker
          </motion.h1>
        </main>

        <motion.div className="css-asterisk" style={{ y: yAsterisk }}>
          <div className="ast-arm" /><div className="ast-arm" /><div className="ast-arm" />
        </motion.div>
        
        <motion.div className="css-pills" style={{ y: yPills }}>
          <div className="css-pill" /><div className="css-pill" /><div className="css-pill" />
        </motion.div>

        <motion.div 
          className="scroll-action"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Link to="/readme-maker" className="scroll-btn">Start Building →</Link>
        </motion.div>
      </div>

      <section className="landing-stats reveal reveal-fade-up">
        <div className="landing-container">
          {stats.map((s, i) => (
            <div key={s.label} className={`stat-card reveal reveal-zoom-in delay-${(i + 1) * 100}`}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-container">
          <div className="section-label-tag reveal reveal-fade-up">What's inside</div>
          <h2 className="landing-section-title reveal reveal-fade-up delay-100">Everything you need to write<br />a <span className="accent-text">perfect README</span></h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={f.title} className={`feature-card reveal reveal-fade-up delay-${(i % 4 + 1) * 100}`}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-container">
          <div className="cta-box reveal reveal-zoom-in">
            <div className="cta-badge">Free & Open Source</div>
            <h2 className="cta-title">Ready to craft your README?</h2>
            <p className="cta-sub">No sign-up. No limits. Just a great README in under 60 seconds.</p>
            <div className="cta-buttons">
              <Link to="/readme-maker" className="cta-btn cta-btn--primary">
                Start Building
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/how-to-use" className="cta-btn cta-btn--secondary">How It Works</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
}
