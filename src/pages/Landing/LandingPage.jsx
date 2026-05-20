import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEOHead from '../../components/shared/SEOHead';
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

function MagneticButton({ children, className }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const statsRef = useRef(null);
  const { scrollY, scrollYProgress } = useScroll();
  
  // Smooth out the scroll progress for the top bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transforms mapped to scroll position
  const yAsterisk = useTransform(scrollY, [0, 1000], [0, 300]);
  const yPills = useTransform(scrollY, [0, 1000], [0, -200]);
  
  const yCodeBlock1 = useTransform(scrollY, [0, 2000], [0, -250]);
  const yCodeBlock2 = useTransform(scrollY, [0, 2000], [0, 400]);

  // SVG ribbon drawing — scoped to stats section
  const { scrollYProgress: statsProgress } = useScroll({
    target: statsRef,
    offset: ["start 0.8", "end -1"]
  });

  // Direct 1:1 scroll-to-draw: ribbons extend as you scroll down, retract on scroll up
  const ribbonDraw = useTransform(statsProgress, [0, 1], [0, 1]);

  return (
    <>
      <SEOHead
        title="READMEForge — Generate Professional GitHub READMEs in 30 Seconds"
        description="Free, open-source README generator. Live preview, 8 templates, quality scoring, and one-click export. No sign-up required."
      />
      
      {/* Scroll Progress Bar */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      <div className="page-transition" style={{ position: 'relative' }}>


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
      </div>

      {/* CTA button sits outside the masked hero-wrapper */}
      <motion.div 
        className="scroll-action"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ position: 'relative', zIndex: 20, marginTop: -60 }}
      >
        <Link to="/readme-maker" className="scroll-btn">Start Building →</Link>
      </motion.div>

      <section ref={statsRef} className="landing-stats" style={{ position: 'relative', zIndex: 2, overflow: 'visible' }}>
        {/* SVG ribbons — originate from behind the cards, flow downward */}
        <svg
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: 0, 
            width: '100%', 
            height: '1200px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          viewBox="0 0 1000 1200" 
          preserveAspectRatio="none"
        >
          {/* Ribbon 1 — from "Templates" card, sweeping S-curves */}
          <motion.path 
            d="M 125 0 C 40 80, 280 120, 160 200 C 40 280, 320 340, 180 420 C 40 500, 400 560, 280 660 C 160 760, 550 850, 700 1200" 
            stroke="var(--accent)" 
            strokeWidth="1.5" 
            fill="none" 
            style={{ pathLength: ribbonDraw }} 
            opacity="0.15"
          />
          {/* Ribbon 2 — from "Tech Chips" card, tight zigzag loops */}
          <motion.path 
            d="M 375 0 C 520 50, 180 120, 440 200 C 700 280, 200 380, 500 460 C 800 540, 250 640, 540 740 C 780 840, 380 960, 500 1200" 
            stroke="var(--accent2)" 
            strokeWidth="1.2" 
            fill="none" 
            style={{ pathLength: ribbonDraw }} 
            opacity="0.12"
          />
          {/* Ribbon 3 — from "Sections" card, wide dramatic arcs */}
          <motion.path 
            d="M 625 0 C 950 80, 50 200, 750 320 C 1050 400, 150 520, 680 640 C 900 720, 250 840, 550 960 C 700 1050, 300 1120, 450 1200" 
            stroke="var(--accent)" 
            strokeWidth="1" 
            fill="none" 
            style={{ pathLength: ribbonDraw }} 
            opacity="0.1"
          />
          {/* Ribbon 4 — from "Quality Score" card, spiral to the left */}
          <motion.path 
            d="M 875 0 C 980 60, 680 140, 860 240 C 1040 340, 580 440, 760 540 C 480 640, 820 740, 540 840 C 260 940, 680 1060, 400 1200" 
            stroke="var(--accent2)" 
            strokeWidth="0.8" 
            fill="none" 
            style={{ pathLength: ribbonDraw }} 
            opacity="0.08"
          />
        </svg>

        <motion.div 
          className="landing-container"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {stats.map((s) => (
            <motion.div key={s.label} className="stat-card" variants={staggerItem}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Parallax Glassmorphic Code Blocks */}
      <motion.div className="parallax-code-block block-left" style={{ y: yCodeBlock1, rotate: -5 }}>
        <div className="code-header"><span className="dot"/><span className="dot"/><span className="dot"/></div>
        <pre><code>## Features{'\n'}- Live preview{'\n'}- Auto-save</code></pre>
      </motion.div>
      
      <motion.div className="parallax-code-block block-right" style={{ y: yCodeBlock2, rotate: 3 }}>
        <div className="code-header"><span className="dot"/><span className="dot"/><span className="dot"/></div>
        <pre><code>git add README.md{'\n'}git commit -m "docs"</code></pre>
      </motion.div>

      <section className="landing-features" style={{ position: 'relative', zIndex: 2 }}>
        <div className="landing-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-label-tag"
          >
            What's inside
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="landing-section-title"
          >
            Everything you need to write<br />a <span className="accent-text">perfect README</span>
          </motion.h2>

          <motion.div 
            className="features-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((f) => (
              <motion.div key={f.title} className="feature-card" variants={staggerItem}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="landing-cta" style={{ position: 'relative', zIndex: 2 }}>
        <div className="landing-container">
          <motion.div 
            className="cta-box"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="cta-badge">Free & Open Source</div>
            <h2 className="cta-title">Ready to craft your README?</h2>
            <p className="cta-sub">No sign-up. No limits. Just a great README in under 60 seconds.</p>
            <div className="cta-buttons">
              <MagneticButton>
                <Link to="/readme-maker" className="cta-btn cta-btn--primary">
                  Start Building
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/how-to-use" className="cta-btn cta-btn--secondary">How It Works</Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
}
