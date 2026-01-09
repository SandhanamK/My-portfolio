import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import myPhoto from './image/IMG20240922123246-min-removebg-preview-removebg-preview (1).png'
import aboutImage from './landing page image/WhatsApp Image 2025-10-18 at 18.26.21_59e938dc.jpg'
import './portfolio.css'
import { FaGithub, FaExternalLinkAlt, FaFilePdf } from 'react-icons/fa';
import GitHubProjects from './components/GitHubProjects';
import BeeFloat from './components/BeeFloat.jsx'

const THEMES = [
  { name: 'Cocoa', bg: '#2b190f', fg: '#e7d6c9', accent: '#cdb2a9', line: 'rgba(231,214,201,0.25)' },
  { name: 'Ivory', bg: '#eee6db', fg: '#6b2d12', accent: '#b24e1d', line: 'rgba(107,45,18,0.35)' },
  { name: 'Olive', bg: '#585332', fg: '#e2dfcb', accent: '#bab493', line: 'rgba(226,223,203,0.35)' },
  { name: 'Deep Sea', bg: '#05323c', fg: '#e6d2df', accent: '#c89db5', line: 'rgba(230,210,223,0.35)' }
]

function ThemeSquares({ themeIndex, setThemeIndex, themeNames }) {
  const handleClick = () => setThemeIndex((i) => (i + 1) % themeNames.length)
  return (
    <button
      className="theme-squares"
      onClick={handleClick}
      aria-label={`Change theme. Current: ${themeNames[themeIndex]}`}
      title={`Theme: ${themeNames[themeIndex]} (click to change)`}>
      <div className="grid">
        {themeNames.map((_, i) => (
          <span key={i} className={`cell ${i === themeIndex ? 'active' : ''}`} />
        ))}
      </div>
      <span className="hint">See Things Differently </span>
    </button>
  )
}

export default function Portfolio({ onBack, themeIndex: propThemeIndex, setThemeIndex: propSetThemeIndex }) {
  const [localThemeIndex, setLocalThemeIndex] = useState(0)
  const themeIndex = propThemeIndex !== undefined ? propThemeIndex : localThemeIndex
  const setThemeIndex = propSetThemeIndex || setLocalThemeIndex

  const [showLogoName, setShowLogoName] = useState(false)
  const theme = useMemo(() => THEMES[themeIndex], [themeIndex])
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const projectsRef = useRef(null)
  const experienceRef = useRef(null)
  const contactRef = useRef(null)
  const navigate = useNavigate()
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeSection, setActiveSection] = useState('hero')
  const [showContact, setShowContact] = useState(false)


  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNavClick = (section) => {
    const refs = {
      'about-me': aboutRef,
      'skills': skillsRef,
      'projects': projectsRef,
      'experience': experienceRef,
      'contacts': contactRef
    }
    scrollToSection(refs[section])
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      const cursor = document.querySelector('.pf-cursor')
      if (cursor) {
        cursor.style.left = e.clientX + 'px'
        cursor.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const sections = [
      { key: 'hero', ref: heroRef },
      { key: 'about', ref: aboutRef },
      { key: 'skills', ref: skillsRef },
      { key: 'projects', ref: projectsRef },
      { key: 'experience', ref: experienceRef },
      { key: 'contacts', ref: contactRef }
    ]

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3
      for (const section of sections) {
        const el = section.ref.current
        if (!el) continue
        const top = el.offsetTop
        const height = el.offsetHeight
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection((prev) => (prev === section.key ? prev : section.key))
          return
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for scroll reveal in Portfolio
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('[data-reveal], .reveal-stagger');
    revealElements.forEach(el => observer.observe(el));

    return () => revealElements.forEach(el => observer.unobserve(el));
  }, []);

  const beeMode = useMemo(() => {
    if (activeSection === 'skills') return 'rightToLeft'
    if (activeSection === 'experience') return 'rightToCenter'
    if (activeSection === 'contacts') return 'left'
    return 'right'
  }, [activeSection])

  return (
    <div
      className="portfolio"
      id="portfolio"
      style={{
        ['--bg']: theme.bg,
        ['--fg']: theme.fg,
        ['--accent']: theme.accent,
        ['--line']: theme.line
      }}>
      <ThemeSquares
        themeIndex={themeIndex}
        setThemeIndex={setThemeIndex}
        themeNames={THEMES.map((t) => t.name)}
      />

      <div className="pf-bee-container" aria-hidden="true">
        <BeeFloat accent={theme.accent} mode={beeMode} />
      </div>

      <nav className="pf-navbar">
        <button
          className="logo-small pf-nav-logo"
          onMouseEnter={() => setShowLogoName(true)}
          onMouseLeave={() => setShowLogoName(false)}
          onClick={() => window.location.reload()}
          title="Sandanam"
        >
          <span className="pf-logo-char">S</span>
          {showLogoName ? <span className="logo-name">ANDHANAM.K</span> : null}
        </button>
        <div className="pf-nav-links">
          <a href="#about-me" onClick={(e) => { e.preventDefault(); handleNavClick('about-me') }}>About</a>
          <a href="#skills" onClick={(e) => { e.preventDefault(); handleNavClick('skills') }}>Skills</a>
          <a href="#projects" onClick={(e) => { e.preventDefault(); handleNavClick('projects') }}>Projects</a>
          <a href="#experience" onClick={(e) => { e.preventDefault(); handleNavClick('experience') }}>Experience</a>
          <a href="#contacts" onClick={(e) => {
            e.preventDefault();
            setShowContact(!showContact);
            if (!showContact) {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
              });
            }
          }}>Contact</a>
        </div>
        <button
          className="pf-page-toggle"
          title="Open ART view"
          aria-label="Switch to art portfolio"
        >
          <label className="pf-toggle">
            <input type="checkbox" onChange={onBack} />
            <span className="slider" data-off="PRO" data-on="ART"></span>
          </label>
        </button>
      </nav>

      <aside className="pf-social" aria-label="Social links">
        <a href="https://github.com/SandhanamK" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub" className="ico">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.85 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05 .9 1.58 2.37 1.12 2.95.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .85-.28 2.8 1.05a9.37 9.37 0 0 1 5.1 0c1.95-1.33 2.8-1.05 2.8-1.05 .55 1.42.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.67.95.67 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.68.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" /></svg>
        </a>
        <a href="https://www.linkedin.com/in/sandanam-k/" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn" className="ico">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6.94 3.5A2.44 2.44 0 1 1 2.06 3.5a2.44 2.44 0 0 1 4.88 0ZM2.5 8h4.98v13.5H2.5V8Zm7.52 0H15v1.85h.07c.63-1.2 2.17-2.46 4.46-2.46 4.77 0 5.65 3.14 5.65 7.22V21.5h-5V15.2c0-1.5-.03-3.42-2.09-3.42-2.1 0-2.42 1.64-2.42 3.33v8.39h-5V8Z" /></svg>
        </a>
        <a href="https://www.instagram.com/mr.__.sandy?igsh=cGY3YmxzN2hvZmZ3" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className="ico">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <defs>
              <linearGradient id="insta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="5%" stopColor="#fdf497" />
                <stop offset="45%" stopColor="#fd5949" />
                <stop offset="60%" stopColor="#d6249f" />
                <stop offset="90%" stopColor="#285AEB" />
              </linearGradient>
            </defs>
            <path
              fill="url(#insta-gradient)"
              d="M12 2.5c2.7 0 3 .02 4.05.08 2.78.13 4.2 1.42 4.37 4.17.06 1.05.08 1.38.08 4.25 0 2.87-.02 3.2-.08 4.25-.17 2.75-1.6 4.04-4.37 4.17-1.05.06-1.38.08-4.05.08s-2.98-.02-4.05-.08c-2.77-.13-4.2-1.42-4.37-4.17C3.52 14.2 3.5 13.87 3.5 12s.02-3.2.08-4.25c.17-2.75 1.6-4.04 4.37-4.17C9.02 3.52 9.35 3.5 12 3.5m0-2.5C9.3 1 8.95 1.02 7.88 1.08 4.55 1.3 2.8 3.15 2.58 6.38 2.52 7.45 2.5 7.8 2.5 12s.02 4.55.08 5.63c.22 3.23 1.97 4.97 5.2 5.2 1.07.05 1.42.07 4.22.07s3.15-.02 4.22-.07c3.23-.23 4.98-1.97 5.2-5.2.06-1.07.08-1.42.08-4.22s-.02-3.15-.08-4.22c-.22-3.23-1.97-4.97-5.2-5.2C15.45 1.02 15.1 1 12 1z"
            />
            <path
              fill="url(#insta-gradient)"
              d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8z"
            />
            <circle fill="#fff" cx="17.5" cy="6.5" r="1.5" />
          </svg>
        </a>
      </aside>

      <div className="pf-cursor" />

      <section className="pf-hero-section" ref={heroRef} data-reveal>
        <div className="pf-container">
          <header className="pf-hero">
            <div className="pf-intro reveal-stagger">
              <h1 className="pf-title">
                <span className="muted-small">Hi, I'm Sandanam K</span>
                <br />
                <span className="accent-small">Full-Stack Developer, Startup Enthusiast, UI/UX Designer.</span>
              </h1>
              <p className="pf-sub">I'm a passionate software developer specializing in building modern web applications and IoT solutions.</p>
              <div className="pf-actions">
                <a className="btn" href="#contacts" onClick={(e) => { e.preventDefault(); handleNavClick('contacts') }}>Contact me</a>
                <a className="btn" href="https://docs.google.com/document/d/1BKGk7leSRuWze_-KSv5jrAS727_4gk2VzwA7bX4_m0A/edit?usp=sharing" target="_blank" rel="noopener noreferrer">My Resume</a>
              </div>
            </div>
            <figure className="pf-photo" data-reveal>
              <img src={myPhoto} alt="Portrait" />
              <figcaption className="pf-status"><span className="dot" />Currently Studying in Kalvium</figcaption>
            </figure>
          </header>
        </div>
      </section>

      <section id="about-me" className="pf-section" ref={aboutRef} data-reveal>
        <div className="pf-container">
          <h2 className="pf-section-title"># # about-me</h2>
          <div className="pf-about-grid reveal-stagger">
            <div className="pf-about-image" data-reveal>
              <img src={aboutImage} alt="About me" />
            </div>
            <div className="pf-about-content">
              <p className="pf-about-text">
                Hi, I'm Sandanam K! I'm a passionate software developer specializing in building modern web applications and IoT solutions.
              </p>
              <p className="pf-about-text">
                I love turning complex ideas into clean, efficient, and user-friendly digital experiences. Whether it's creating responsive web interfaces, developing scalable backend systems, or exploring innovative IoT solutions, I bring creativity and technical expertise to every project.
              </p>
              <p className="pf-about-text">
                Currently pursuing my studies at Kalvium, I'm constantly learning and staying updated with the latest technologies and best practices in software development.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="pf-section pf-section-dark" ref={skillsRef} data-reveal>
        <div className="pf-container">
          <h2 className="pf-section-title"># # skills</h2>
          <div className="pf-skills reveal-stagger">
            <div className="skill-col">
              <h4>Languages</h4>
              <ul>
                <li>Python (Advanced)</li>
                <li>C++ (Intermediate)</li>
                <li>JavaScript</li>
              </ul>
            </div>
            <div className="skill-col">
              <h4>Frontend</h4>
              <ul>
                <li>HTML5, CSS3, JavaScript</li>
                <li>React.js</li>
                <li>Tailwind CSS</li>
                <li>Responsive Design</li>
              </ul>
            </div>
            <div className="skill-col">
              <h4>Backend</h4>
              <ul>
                <li>Node.js, Express.js</li>
                <li>REST API Design</li>
                <li>JWT Authentication</li>
              </ul>
            </div>
            <div className="skill-col">
              <h4>Databases</h4>
              <ul>
                <li>MongoDB (NoSQL)</li>
                <li>MySQL (SQL)</li>
              </ul>
            </div>
            <div className="skill-col">
              <h4>Design</h4>
              <ul>
                <li>Figma</li>
                <li>UI/UX Design</li>
                <li>Prototyping</li>
              </ul>
            </div>
            <div className="skill-col">
              <h4>Cloud & Tools</h4>
              <ul>
                <li>Firebase</li>
                <li>Google Cloud Pub/Sub</li>
                <li>Git, Bruno, Netlify, Render</li>
              </ul>
            </div>
            <div className="skill-col">
              <h4>AI & APIs</h4>
              <ul>
                <li>OpenAI Integration</li>
                <li>RESTful APIs</li>
                <li>Third-party API Integration</li>
              </ul>
            </div>
            <div className="skill-col">
              <h4>IoT & Hardware</h4>
              <ul>
                <li>Arduino, ESP32</li>
                <li>Circuit Design, Embedded Systems</li>
                <li>MATLAB, Multisim</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="pf-section" ref={projectsRef} data-reveal>
        <div className="pf-container">
          <h2 className="pf-section-title"># # projects</h2>
          <div className="reveal-stagger">
            <GitHubProjects />
          </div>
        </div>
      </section>

      <section id="experience" className="pf-section pf-section-dark" ref={experienceRef} data-reveal>
        <div className="pf-container">
          <h2 className="pf-section-title"># # experience</h2>
          <div className="pf-experience-content reveal-stagger">
            <div className="pf-timeline-item">
              <h3 className="pf-timeline-title">Education</h3>
              <div className="pf-education-item">
                <div className="pf-education-header">
                  <h4>Kalvium's UG program in CS (Software Product Engineering)</h4>
                  <span className="pf-education-year">2024-28</span>
                </div>
                <p className="pf-education-detail">Campus: Coimbatore | Bachelor's enrollment: BCA, University Of Mysore</p>
              </div>
              <div className="pf-education-item">
                <div className="pf-education-header">
                  <h4>Bharath Polytechnic College (DEEE)</h4>
                  <span className="pf-education-year">2021-24</span>
                </div>
                <p className="pf-education-detail">Campus: Chennai | Diploma in Electrical and Electronics Engineering</p>
              </div>
            </div>
            <div className="pf-timeline-item">
              <h3 className="pf-timeline-title">Achievements & Hackathons</h3>
              <p className="pf-timeline-desc">🥇 Won Intra-College Hackathon – Led frontend development for an Alcohol Awareness project</p>
              <p className="pf-timeline-desc">💻 GDG (Google Developer Group) Hackathon – Full Stack Developer for Code Learner project</p>
              <p className="pf-timeline-desc">⚡ Kalvium's Promprepo Hackathon – Backend Developer for Team Coders</p>
              <p className="pf-timeline-desc">🦊 Hack The Horizon 2.0 – Backend Developer for Team CodeFox</p>
              <p className="pf-timeline-desc"><strong>VERIFY</strong>: Participated in GDG Hackathon (24hr), won 1st prize in Inter‑College Hackathon (Alcohol Awareness), participated in Kalvium Labs Hackathon and Promtptrepo Hackathon.</p>
            </div>
            <div className="pf-timeline-item">
              <h3 className="pf-timeline-title">Badge</h3>
              <p className="pf-timeline-desc">🧪 Salters’ Chemistry Camp</p>
              <p className="pf-timeline-desc"><strong>VERIFY</strong>: Selected to participate in Salters’ Chemistry Camp at JRC Bangalore, Asia’s first chemistry museum, with students from across Karnataka.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="section section--contact"
        id="contacts"
        ref={contactRef}
        data-reveal
      >
        <div className="pf-container">
          <h2 className="pf-section-title"># # contact</h2>
        </div>
        <div className="section-inner contact-grid reveal-stagger">
          <div className="contact-eyebrow">LET’S START THE CONVERSATION</div>
          <div className="contact-title" role="heading" aria-level="2">
            <span className="line">GREAT DESIGN ISN’T JUST</span>
            <span className="line">ABOUT WHAT YOU MAKE IT’S</span>
            <span className="line">ABOUT WHO YOU MAKE IT WITH.</span>
          </div>
          <div className="contact-copy">
            <span className="line">I partner with those who value thoughtful,</span>
            <span className="line">intentional work that speaks with purpose. If</span>
            <span className="line">you’re ready to be heard, I’m ready to listen.</span>
          </div>
        </div>
      </section>


      {selectedProject && (
        <div className="pf-modal-overlay" role="dialog" aria-modal="true" onClick={() => setSelectedProject(null)}>
          <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pf-modal-close" aria-label="Close" onClick={() => setSelectedProject(null)}>✕</button>
            <h3 className="pf-modal-title">{selectedProject.title}</h3>
            <div className="pf-modal-date">{selectedProject.date}</div>
            <p className="pf-modal-summary">{selectedProject.summary}</p>
            <div className="pf-modal-subhead">Key Features:</div>
            <ul className="pf-modal-list">
              {selectedProject.features.map((f, i) => (<li key={i}>{f}</li>))}
            </ul>
            <div className="pf-modal-subhead">Tech Stack:</div>
            <ul className="pf-modal-tech">
              {Object.entries(selectedProject.tech).map(([k, v]) => (
                <li key={k}><strong>{k}:</strong> {v}</li>
              ))}
            </ul>
            <div className="pf-modal-links">
              {selectedProject.links.map((l, i) => (
                <a key={i} className="btn" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <nav className="footer-links" aria-label="Footer">
              <a href="#terms">TERMS</a>
              <a href="#privacy">PRIVACY</a>
              <a href="#siteby">SITE BY SANDANAM.K</a>
            </nav>
            <div className="copyright">© 2004—{new Date().getFullYear()} Sandanam.K</div>
            <div className="mini-dots" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
          </div>
          <div className="footer-right">
            <a className="footer-cta" href="mailto:santhanamk9604@gmail.com">
              <span className="label">SANTHANAMK9604@GMAIL.COM</span>
              <span className="external-icon" aria-hidden="true" />
            </a>
            <a className="footer-cta" href="#schedule">
              <span className="label">SCHEDULE A CALL</span>
              <span className="external-icon" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}