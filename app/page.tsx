'use client';
import { useState, useEffect, useRef } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const EXPERIENCE = {
  period: 'SUMMER 2025',
  company: 'Ketjen Corporation',
  role: 'Data Engineering Intern',
  description:
    'Implemented distributed data engineering workflows on Databricks to support enterprise-scale analytics. Developed a modular PySpark validation framework integrated into Spark ETL pipelines to enforce data quality across 40-50 GB/day batch workloads.',
  skills: ['PySpark', 'Databricks', 'Azure', 'SQL', 'Power BI'],
};

const PROJECTS = [
  {
    num: '01',
    title: 'Vigilant Data',
    href: 'https://github.com/CMacedo01/Vigilant_Data',
    description:
      'Macroeconomic forecasting platform where I experimented with ML development and \nLLM integration.',
    skills: ['ETL', 'LLMs', 'PostgreSQL', 'FastAPI', 'Docker'],
  },
  {
    num: '02',
    title: 'Questly',
    href: 'https://github.com/CMacedo01/Questly',
    description:
      'My first individual full-stack project. A custom itinerary generator using Google Maps API and personalized logic to create unique day itineraries in your city.',
    skills: [],
  },
  {
    num: '03',
    title: 'Nourish',
    href: 'https://github.com/SR-CAPSTONE-TEAM2/LifestyleExposureGeneralHealthApp',
    description:
      'Nourish is a health-focused web platform developed as my capstone project that helps users track lifestyle and environmental factors affecting their well-being. The system includes features for user authentication, structured data collection, and database-backed storage, enabling users to record and analyze exposures related to diet, health, and daily habits.',
    skills: ['Supabase', 'Expo', 'CI/CD', 'Docker'],
  },
  {
    num: '04',
    title: 'Tiny Social Network Service',
    href: 'https://github.com/CMacedo01/TSMS',
    description:
      'A distributed microblogging system designed to simulate the backend architecture of a social networking platform.',
    skills: ['gRPC', 'RabbitMQ', 'C++', 'Docker'],
  },
  {
    num: '05',
    title: 'Technical Trading Neural Net',
    href: 'https://github.com/CMacedo01/TechnicalTradingNeuralNet',
    description:
      'This project explores the use of deep learning to generate trading signals from financial market data. The model processes historical price data and technical indicators such as Relative Strength Index (RSI), moving averages, and trading volume to learn patterns associated with short-term market movements.',
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn'],
  },
  {
    num: '06',
    title: 'Panda POS',
    href: 'https://github.com/CMacedo01/panda-express-store-system',
    description: 'Panda POS is a full-stack point-of-sale system where I developed frontend components and integrated them with a PostgreSQL database using SvelteKit, Tailwind CSS, and Drizzle ORM to support order processing and transaction management.',
    skills: ['Svelte-kit', 'Tailwind CSS', 'PostgreSQL', 'Drizzy ORM'],
  }
];

// ─── PIXEL RAIN ───────────────────────────────────────────────────────────────
// Reusable rain component: renders a canvas that fills its nearest
// `position:relative` parent. Use inside each section.

function PixelRain({ opacity = 0.6 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    const getW = () => parent ? parent.offsetWidth  : window.innerWidth;
    const getH = () => parent ? parent.offsetHeight : window.innerHeight;

    const resize = () => {
      canvas.width  = getW();
      canvas.height = getH();
    };
    resize();

    const ro = new ResizeObserver(resize);
    if (parent) ro.observe(parent);

    type Drop = { x: number; y: number; speed: number; opacity: number; tail: number; color: string };
    // Mostly cyan, occasional white, rare orange spark
    const COLORS = ['#7dd3fc','#7dd3fc','#7dd3fc','#7dd3fc','#bae6fd','#e0f2fe','#ff4500'];
    const PIXEL  = 3;

    const makeDrops = (): Drop[] => {
      const cols = Math.ceil(getW() / 14);  // Increased density (was 18)
      return Array.from({ length: cols }, () => ({
        x:       Math.random() * getW(),
        y:       Math.random() * -getH(),
        speed:   0.35 + Math.random() * 1.1,
        opacity: 0.18 + Math.random() * 0.55,  // Increased brightness (was 0.12 + 0.45)
        tail:    4 + Math.floor(Math.random() * 9),
        color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    let drops = makeDrops();
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      for (const d of drops) {
        for (let t = 0; t < d.tail; t++) {
          const py = d.y - t * (PIXEL + 2);
          if (py < -PIXEL || py > h) continue;
          const fade = ((d.tail - t) / d.tail) ** 2;
          ctx.globalAlpha = d.opacity * fade;
          ctx.fillStyle = d.color;
          ctx.fillRect(d.x, py, PIXEL, PIXEL);
        }
        d.y += d.speed;
        if (d.y - d.tail * (PIXEL + 2) > h) {
          d.y       = -PIXEL;
          d.x       = Math.random() * w;
          d.speed   = 0.35 + Math.random() * 1.1;
          d.opacity = 0.18 + Math.random() * 0.55;  // Increased brightness (was 0.12 + 0.45)
          d.tail    = 4 + Math.floor(Math.random() * 9);
          d.color   = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      style={{ opacity }}
    />
  );
}

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

function SectionHeader({ title, color = 'cyan' }: { title: string; color?: 'cyan' | 'amber' }) {
  const letters = title.split('');
  const isCyan = color === 'cyan';
  return (
    <div className="relative z-20 mb-12 md:mb-20 flex flex-col items-center">
      <h2
        className={isCyan ? 'hollow-glow font-black uppercase tracking-[0.2em]' : 'hollow-glow-gold font-black uppercase tracking-[0.2em]'}
        style={{ fontSize: 'clamp(2rem, 7vw, 5rem)' }}
      >
        {letters.map((l, i) => (
          <span
            key={i}
            className="electric-letter"
            style={{
              animationDelay: `${i * 0.08}s, ${i * 0.08}s`,
              /* each letter's cycle is offset so the jumble ripples across */
              animationDuration: `${7 + (i % 3) * 1.2}s, ${7 + (i % 3) * 1.2}s`,
            }}
          >
            {l === ' ' ? '\u00A0' : l}
          </span>
        ))}
      </h2>
      <div className={`mt-3 md:mt-5 h-2 md:h-3 w-32 md:w-56 rounded-full ${isCyan ? 'bg-sky-300 shadow-[0_0_25px_#7dd3fc]' : 'bg-[#ff4500] shadow-[0_0_25px_#ff4500]'}`} />
    </div>
  );
}

// Cyan-only skill pill (used in projects + experience)
function SkillPill({ label }: { label: string }) {
  return (
    <span
      className="inline-block rounded-full border border-sky-400/60 bg-sky-400/10 text-sky-300 px-2 py-0.5 font-bold uppercase tracking-wider whitespace-nowrap shadow-[0_0_8px_rgba(125,211,252,0.25)] transition-all duration-300 cursor-default"
      style={{ fontSize: 'clamp(0.55rem, 1vw, 0.75rem)' }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-3px) scale(1.08)';
        el.style.background = 'rgba(125,211,252,0.22)';
        el.style.boxShadow = '0 0 22px rgba(125,211,252,0.7), 0 4px 16px rgba(0,0,0,0.5)';
        el.style.borderColor = 'rgba(125,211,252,0.95)';
        el.style.color = '#fff';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.transform = '';
        el.style.background = '';
        el.style.boxShadow = '';
        el.style.borderColor = '';
        el.style.color = '';
      }}
    >{label}</span>
  );
}

// ─── SKILLS DISK ─────────────────────────────────────────────────────────────

function round6(n: number) { return Math.round(n * 1e6) / 1e6; }
function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: round6(cx + r * Math.cos(rad)), y: round6(cy + r * Math.sin(rad)) };
}

function SkillsDisk() {
  const SIZE    = 600;
  const CX      = 300;
  const CY      = 300;
  const R_OUTER = 280;
  const R_INNER = 38;

  // Each sector gets a single foreignObject centred at R_CONTENT_MID
  // that contains the header + chips stacked vertically.
  const R_CONTENT_MID = R_OUTER * 0.62; // centre of the combined header+chips zone

  const sectors = [
    { id: 'lang',  startDeg: 330, endDeg:  90, label: 'Languages',  color: '#ff4500', skills: ['Python','SQL','C++','Java','Haskell','TypeScript'],  yOffset: 18 },
    { id: 'frame', startDeg:  90, endDeg: 210, label: 'Frameworks', color: '#ff4500', skills: ['Next.js','React','Supabase','Expo', 'PyTorch','Svelte','FastAPI'],             yOffset: 14 },
    { id: 'tools', startDeg: 210, endDeg: 330, label: 'Tools',      color: '#ff4500', skills: ['Databricks','Spark','Azure','Docker','Git', 'Unix'],          yOffset: 0  },
  ];

  function sectorPath(s: number, e: number, r: number) {
    const normalE = e <= s ? e + 360 : e;
    const large   = (normalE - s) > 180 ? 1 : 0;
    const start   = polarToXY(CX, CY, r, s);
    const end     = polarToXY(CX, CY, r, normalE);
    return `M ${CX} ${CY} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
  }

  function midAngle(s: number, e: number) {
    const ne = e <= s ? e + 360 : e;
    return s + (ne - s) / 2;
  }

  // foreignObject dimensions — wide enough to show chips, tall enough for header+chips
  const FO_W = 210;
  const FO_H = 190;

  return (
    <div className="relative flex items-center justify-center w-full" style={{ height: 'min(85.5vh, 85.5vw)', maxHeight: '741px' }}>
      {/* Orbiting outer decorative ring — separate SVG so it can be larger */}
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute pointer-events-none overflow-visible z-0"
           style={{ width: 'min(89.3vh, 89.3vw)', height: 'min(89.3vh, 89.3vw)', maxWidth: '779px', maxHeight: '779px' }}>
        <defs>
          <filter id="glow-w2" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="b"/>
            <feComposite in="SourceGraphic" in2="b" operator="over"/>
          </filter>
        </defs>
        {/* Outer decorative ring */}
        <circle cx={CX} cy={CY} r={R_OUTER+22} strokeWidth="8" fill="none" stroke="#e0f2fe" opacity="0.85"
          style={{ filter: 'drop-shadow(0 0 10px #fff)' }}/>
        <circle cx={CX} cy={CY} r={R_OUTER+46} strokeWidth="2.5" fill="none" stroke="#e0f2fe" opacity="0.2"
          style={{ filter: 'drop-shadow(0 0 4px #e0f2fe)' }}/>
        {/* Orbiting dot */}
        <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: 'orbit-disk 4s linear infinite' }}>
          <circle cx={CX} cy={CY - (R_OUTER + 22)} r="8" fill="#e0f2fe" filter="url(#glow-w2)"/>
        </g>
      </svg>

      {/* Main disk SVG — outer ring pulses on hover via CSS class */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="skills-disk-svg relative z-10"
        style={{ width: 'min(83.6vh, 83.6vw)', height: 'min(83.6vh, 83.6vw)', maxWidth: '722px', maxHeight: '722px', overflow: 'visible' }}
      >
        <defs>
          {sectors.map(s => (
            <clipPath key={`cp-${s.id}`} id={`cp2-${s.id}`}>
              <path d={sectorPath(s.startDeg, s.endDeg, R_OUTER - 1)}/>
            </clipPath>
          ))}
          <filter id="amber-glow2" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feComposite in="SourceGraphic" in2="b" operator="over"/>
          </filter>
          <filter id="ring-glow-idle" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <filter id="ring-glow-hover" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        {/* ── SECTOR BACKGROUNDS — alternating subtle tints ── */}
        {sectors.map((s, i) => (
          <path key={`bg-${s.id}`}
            d={sectorPath(s.startDeg, s.endDeg, R_OUTER)}
            fill={i % 2 === 0 ? 'rgba(255,69,0,0.03)' : 'rgba(125,211,252,0.02)'}
          />
        ))}

        {/* ── DIVIDER LINES ── */}
        {[330, 90, 210].map(angle => {
          const p = polarToXY(CX, CY, R_OUTER, angle);
          return <line key={angle} x1={CX} y1={CY} x2={p.x} y2={p.y}
            stroke="#e0f2fe" strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' }}/>;
        })}

        {/* ── OUTER RING — pulses via CSS on .skills-disk-svg:hover ── */}
        <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#e0f2fe"
          strokeWidth="3"
          className="skills-disk-ring"
        />

        {/* ── SECTOR CONTENT: header + chips in a single foreignObject, clipped to sector ── */}
        {sectors.map(s => {
          const mid = midAngle(s.startDeg, s.endDeg);
          const cp  = polarToXY(CX, CY, R_CONTENT_MID, mid);
          const fx  = cp.x - FO_W / 2;
          const fy  = cp.y - FO_H / 2 + (s.yOffset || 0);
          return (
            <g key={`content-${s.id}`}>
              <foreignObject x={fx} y={fy} width={FO_W} height={FO_H} overflow="visible">
                {/* @ts-ignore */}
                <div xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%', height: '100%', padding: '4px',
                    boxSizing: 'border-box',
                  }}>
                  {/* Header — always on top of the bubbles */}
                  <div style={{
                    fontFamily: 'sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(0.72rem, 1.6vw, 1.05rem)',
                    letterSpacing: '0.12em',
                    color: 'transparent',
                    WebkitTextStroke: '1px #ff4500',
                    filter: 'drop-shadow(0 0 8px rgba(255,69,0,1)) drop-shadow(0 0 18px rgba(255,69,0,0.6))',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    lineHeight: 1.2,
                  }}>
                    {s.label.toUpperCase()}
                  </div>
                  {/* Chips */}
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                    alignContent: 'flex-start', gap: '4px',
                    flex: 1, minHeight: 0,
                    overflow: 'visible',
                  }}>
                    {s.skills.map(skill => (
                      <span key={skill} className="skill-bubble" style={{
                        display: 'inline-block',
                        background: 'rgba(255,69,0,0.15)',
                        border: '1.5px solid rgba(255,100,0,0.85)',
                        boxShadow: '0 0 8px rgba(255,69,0,0.5)',
                        padding: '2px 7px',
                        fontSize: 'clamp(0.42rem, 0.8vw, 0.62rem)',
                        fontWeight: 700,
                        borderRadius: '10px',
                        whiteSpace: 'nowrap',
                        color: '#ffcfba',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>{skill}</span>
                    ))}
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* ── CORE REACTOR ── */}
        <circle cx={CX} cy={CY} r={R_INNER + 5} fill="#010409" stroke="#ff4500" strokeWidth="3.5"
          style={{ filter: 'drop-shadow(0 0 16px rgba(255,69,0,0.9))' }}/>
        <circle cx={CX} cy={CY} r={10} fill="#ff4500" style={{ filter: 'drop-shadow(0 0 12px #ff4500)' }}>
          <animate attributeName="r"       values="8;12;8"  dur="1.6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.5;1" dur="1.6s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
}

// ─── EXPERIENCE SECTION ───────────────────────────────────────────────────────
// Color palette: ORANGE ONLY. No blue at all in this section.

function ExperienceSection() {
  return (
    <section id="experience" className="relative flex min-h-screen w-full flex-col items-center bg-[#010409]/90 px-4 py-20 md:py-32 overflow-hidden">
      <PixelRain opacity={0.4} />

      {/* Corner accents — orange */}
      <div className="pointer-events-none absolute inset-0 z-1">
        <div className="absolute top-0 left-0 h-28 w-px bg-gradient-to-b from-[#ff4500]/60 to-transparent"/>
        <div className="absolute top-0 left-0 h-px w-28 bg-gradient-to-r from-[#ff4500]/60 to-transparent"/>
        <div className="absolute top-0 right-0 h-28 w-px bg-gradient-to-b from-[#ff4500]/60 to-transparent"/>
        <div className="absolute top-0 right-0 h-px w-28 bg-gradient-to-l from-[#ff4500]/60 to-transparent"/>
        <div className="absolute bottom-0 left-0 h-28 w-px bg-gradient-to-t from-[#ff4500]/60 to-transparent"/>
        <div className="absolute bottom-0 left-0 h-px w-28 bg-gradient-to-r from-[#ff4500]/60 to-transparent"/>
        <div className="absolute bottom-0 right-0 h-28 w-px bg-gradient-to-t from-[#ff4500]/60 to-transparent"/>
        <div className="absolute bottom-0 right-0 h-px w-28 bg-gradient-to-l from-[#ff4500]/60 to-transparent"/>
      </div>

      <SectionHeader title="Experience" color="amber" />

      <div className="relative z-10 w-full max-w-4xl">
        <div
          className="exp-card relative border border-[#ff4500]/40 bg-[#0d0a08]/80 backdrop-blur-xl overflow-hidden"
          style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' }}
        >
          {/* Orange scan line */}
          <div className="exp-scan-line" />
          {/* Top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#ff4500] to-transparent shadow-[0_0_20px_#ff4500]" />

          <div className="flex flex-col md:flex-row gap-0">
            {/* Left panel */}
            <div className="relative flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#ff4500]/20 p-6 md:p-10 md:w-64 flex-shrink-0">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#ff4500] via-[#ff4500]/50 to-transparent shadow-[0_0_12px_#ff4500]" />
              <p className="text-[#ff4500]/70 font-black tracking-[0.3em] uppercase text-xs mb-4">{EXPERIENCE.period}</p>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#ff4500] shadow-[0_0_12px_#ff4500] animate-pulse flex-shrink-0" />
                <div className="h-px flex-1 bg-gradient-to-r from-[#ff4500]/60 to-transparent" />
              </div>
              <h3 className="font-black text-white uppercase tracking-tight leading-none mb-2"
                  style={{ fontSize: 'clamp(1.2rem, 3.1vw, 2.1rem)' }}>{EXPERIENCE.company}</h3>
              <p className="text-[#ff4500] font-bold italic tracking-tight"
                 style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1.1rem)' }}>{EXPERIENCE.role}</p>
            </div>
            {/* Right panel */}
            <div className="flex flex-col justify-center gap-6 p-6 md:p-10 flex-1">
              <div className="h-px w-full bg-gradient-to-r from-[#ff4500]/50 via-[#ff4500]/20 to-transparent" />
              <p className="text-slate-200 leading-relaxed uppercase font-medium tracking-wide"
                 style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}>{EXPERIENCE.description}</p>
              <div>
                <p className="text-[#ff4500]/50 text-xs uppercase tracking-[0.3em] font-bold mb-3">// Stack</p>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE.skills.map(s => <SkillPill key={s} label={s} />)}
                </div>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff4500]/20 to-[#ff4500]/50" />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#ff4500] via-[#ff4500]/60 to-transparent shadow-[0_0_20px_#ff4500]" />
        </div>

        {/* Corner brackets — all orange */}
        <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-[#ff4500] shadow-[0_0_10px_#ff4500]" />
        <div className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-[#ff4500] shadow-[0_0_10px_#ff4500]" />
        <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-[#ff4500] shadow-[0_0_10px_#ff4500]" />
        <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-[#ff4500] shadow-[0_0_10px_#ff4500]" />
      </div>
    </section>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
// Color palette: CYAN ONLY.

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[0]; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`project-card block relative w-full border border-sky-400/25 bg-black/70 backdrop-blur-xl overflow-hidden ${isEven ? 'project-card-even' : 'project-card-odd'}`}
      style={{ clipPath: isEven
        ? 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)'
        : 'polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }}
    >
      {/* Subtle grid background that intensifies on hover */}
      <div className="project-card-grid-bg" />
      <div className="absolute top-2 right-3 text-sky-400/40 font-black z-20 transition-colors"
           style={{ fontSize: 'clamp(0.55rem, 1vw, 0.7rem)' }}>↗ VIEW</div>

      {/* Top accent — cyan */}
      <div className={`h-[2px] w-full shadow-[0_0_15px_#7dd3fc] ${isEven ? 'bg-gradient-to-r from-sky-400 via-sky-400/40 to-transparent' : 'bg-gradient-to-r from-transparent via-sky-400/40 to-sky-400'}`} />

      <div className="flex flex-col sm:flex-row gap-0">
        {/* Image placeholder */}
        <div className="relative sm:w-44 md:w-52 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-sky-400/20 bg-black overflow-hidden"
             style={{ minHeight: 'clamp(100px, 15vw, 200px)' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 opacity-10"
                 style={{ backgroundImage:'linear-gradient(#7dd3fc 1px, transparent 1px), linear-gradient(90deg, #7dd3fc 1px, transparent 1px)', backgroundSize:'20px 20px' }}/>
            <span className="relative text-sky-400/20 font-black" style={{ fontSize:'clamp(2rem, 5vw, 4rem)' }}>{project.num}</span>
          </div>
          <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} h-full w-[2px] bg-gradient-to-b from-sky-400 via-sky-400/40 to-transparent shadow-[0_0_10px_#7dd3fc]`}/>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between gap-4 p-5 md:p-6 flex-1">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_#7dd3fc] animate-pulse flex-shrink-0" />
              <p className="text-sky-400/60 font-black tracking-[0.3em] uppercase" style={{ fontSize:'clamp(0.55rem, 1vw, 0.7rem)' }}>
                // Project {project.num}
              </p>
            </div>
            <h3 className="font-black text-white uppercase tracking-tight leading-none mb-3"
                style={{ fontSize:'clamp(1rem, 3vw, 1.75rem)' }}>{project.title}</h3>
            <div className="h-px w-10 bg-sky-400 shadow-[0_0_8px_#7dd3fc] mb-3" />
            <p className="text-slate-400 leading-relaxed uppercase font-medium tracking-wide"
               style={{ fontSize:'clamp(0.65rem, 1.2vw, 0.85rem)' }}>{project.description}</p>
          </div>
          <div>
            <p className="text-sky-400/50 uppercase tracking-[0.3em] font-bold mb-2" style={{ fontSize:'clamp(0.55rem, 1vw, 0.7rem)' }}>// Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {project.skills.map(s => (
                <span key={s} className="skill-pill-project">
                  <SkillPill label={s} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent — cyan */}
      <div className={`h-[2px] w-full shadow-[0_0_12px_#7dd3fc] ${isEven ? 'bg-gradient-to-r from-transparent via-sky-400/40 to-sky-400' : 'bg-gradient-to-r from-sky-400 via-sky-400/40 to-transparent'}`} />
    </a>
  );
}

// ─── PROJECTS SECTION ─────────────────────────────────────────────────────────

function ProjectsSection() {
  return (
    <section id="projects" className="relative min-h-screen w-full bg-[#010409]/90 px-4 py-20 md:py-32 overflow-hidden">
      <PixelRain opacity={0.4} />
      {/* Corner accents — cyan */}
      <div className="pointer-events-none absolute inset-0 z-1">
        <div className="absolute top-0 left-0 h-28 w-px bg-gradient-to-b from-sky-400/50 to-transparent"/>
        <div className="absolute top-0 left-0 h-px w-28 bg-gradient-to-r from-sky-400/50 to-transparent"/>
        <div className="absolute top-0 right-0 h-28 w-px bg-gradient-to-b from-sky-400/50 to-transparent"/>
        <div className="absolute top-0 right-0 h-px w-28 bg-gradient-to-l from-sky-400/50 to-transparent"/>
      </div>
      <SectionHeader title="Projects" color="cyan" />
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="projects-spine" />
        <div className="flex flex-col gap-6 md:gap-10">
          {PROJECTS.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={project.num} className="relative flex items-center">
                <div className="projects-spine-node" />
                <div className={`projects-branch-line hidden md:block ${isEven ? 'projects-branch-left' : 'projects-branch-right'}`} />
                <div className={`w-full md:w-[calc(58%-4rem)] ${isEven ? 'md:mr-auto md:pr-4' : 'md:ml-auto md:pl-4'}`}>
                  <ProjectCard project={project} index={index} />
                </div>
              </div>
            );
          })}
        </div>
        {/* Terminal node — orange accent at bottom of spine */}
        <div className="relative flex justify-center mt-10">
          <div className="h-10 w-10 rounded-full border-2 border-sky-400 bg-black shadow-[0_0_25px_rgba(125,211,252,0.5)] flex items-center justify-center z-10">
            <div className="h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_15px_#7dd3fc] animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── RESUME SECTION ───────────────────────────────────────────────────────────

const RESUME = {
  education: [
    { period: '2022 – 2026', institution: 'Texas A&M University', degree: 'B.S. Computer Science', detail: 'Minor in Statistics · GPA 3.7 / 4.0' },
  ],
  experience: [
    { period: 'Summer 2025', company: 'Albemarle', role: 'Data Engineering Intern', bullets: ['Automated metadata extraction from Unity Catalog via SQL workflows to populate a centralized enterprise data catalog across 6 business domains, improving data discoverability for analytics teams', '•	Built a modular PySpark QA Engine integrated into Databricks pipelines to validate 40-50 GB/day batch ingests, enforcing data quality rules and reducing production incidents', '•	Optimized validation logic and parallelization, cutting data cleaning time by 60%, accelerating ingestion throughput and shortening downstream analytics latency'] },
  ],
  projects: [
    { title: 'Nourish', period: 'Spring 2026', stack: ['Supabase', 'Expo', 'CI/CD', 'PostgreSQL'], bullets: ['•	Engineered a multi-provider authentication system integrating Email and Google OAuth via Supabase Auth, enforcing row-level security (RLS) policies to guarantee strict per-user data isolation at the database layer', '•	Developed CI/CD pipelines using GitHub actions and cloud deployment workflows, reducing release latency by 60% and ensuring continuous updates to the cloud environment'] },
    { title: 'Vigilant Data', period: 'Winter 2025', stack: ['Next.js', 'FastAPI', 'Docker', 'ML', 'LLM'], bullets: ['•	Architected end-to-end data pipelines ingesting macroeconomic time-series data into PostgreSQL, enabling downstream analytics, forecasting, and decision support via ML and LLM-based summarization', '•	Designed and deployed an LLM-driven insight layer using Docker and FastAPI that converts structured economic indicators into human-readable analysis without relying on cloud AI services'] },
    { title: 'Questly', period: 'Summer 2025', stack: ['Typescript', 'MongoDB', 'React', 'Next.js'], bullets: ['•	Built a personalized itinerary engine that curates activities based on budget, distance, availability, and mood; implemented server-side rendering to reduce TTFB and improve perceived load', '•	Engineered an API orchestration layer that cut external API calls by 40%, reducing costs and improving reliability'] },
  ],
  skills: {
    Languages:  ['Python', 'SQL', 'C++', 'Java', 'TypeScript', 'Haskell'],
    Frameworks: ['Next.js', 'React', 'Node', 'PyTorch', 'Svelte', 'FastAPI', 'Supabase', 'Expo'],
    Tools:      ['Databricks', 'Spark', 'Azure', 'Docker', 'Git', 'LLMs', 'CI/CD'],
  },
};

function ResumeSection() {
  return (
    <section id="resume" className="relative min-h-screen w-full bg-[#010409]/90 px-4 py-20 md:py-32 overflow-hidden">
      <PixelRain opacity={0.35} />

      {/* Corner accents alternating cyan/orange */}
      <div className="pointer-events-none absolute inset-0 z-1">
        <div className="absolute top-0 left-0 h-28 w-px bg-gradient-to-b from-sky-400/50 to-transparent"/>
        <div className="absolute top-0 left-0 h-px w-28 bg-gradient-to-r from-sky-400/50 to-transparent"/>
        <div className="absolute top-0 right-0 h-28 w-px bg-gradient-to-b from-[#ff4500]/50 to-transparent"/>
        <div className="absolute top-0 right-0 h-px w-28 bg-gradient-to-l from-[#ff4500]/50 to-transparent"/>
        <div className="absolute bottom-0 left-0 h-28 w-px bg-gradient-to-t from-[#ff4500]/50 to-transparent"/>
        <div className="absolute bottom-0 left-0 h-px w-28 bg-gradient-to-r from-[#ff4500]/50 to-transparent"/>
        <div className="absolute bottom-0 right-0 h-28 w-px bg-gradient-to-t from-sky-400/50 to-transparent"/>
        <div className="absolute bottom-0 right-0 h-px w-28 bg-gradient-to-l from-sky-400/50 to-transparent"/>
      </div>

      <SectionHeader title="Resume" color="cyan" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">

        {/* ── UNIFIED RESUME CARD ── */}
        <div className="border border-sky-400/20 bg-[#050a10]/90 backdrop-blur-xl overflow-hidden"
             style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' }}>

          {/* Top bar */}
          <div className="h-[3px] w-full bg-gradient-to-r from-sky-400 via-sky-300 to-[#ff4500] shadow-[0_0_16px_#7dd3fc]" />

          {/* ── EDUCATION ROW ── */}
          <div className="px-6 md:px-10 pt-8 pb-6 border-b border-sky-400/10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_#7dd3fc] flex-shrink-0" />
              <span className="text-sky-400/70 font-black tracking-[0.35em] uppercase text-xs">Education</span>
            </div>
            {RESUME.education.map((e, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10">
                <div className="flex-shrink-0 sm:w-36">
                  <span className="block text-sky-400/50 font-black tracking-widest uppercase text-xs">{e.period}</span>
                </div>
                <div>
                  <p className="text-white font-black uppercase tracking-tight text-xl md:text-2xl mb-1">{e.institution}</p>
                  <p className="text-sky-300 font-bold text-sm md:text-base">{e.degree}</p>
                  <p className="text-slate-500 italic text-xs md:text-sm mt-0.5">{e.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── EXPERIENCE ROW ── */}
          <div className="px-6 md:px-10 py-6 border-b border-sky-400/10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff4500] shadow-[0_0_10px_#ff4500] flex-shrink-0" />
              <span className="text-[#ff4500]/70 font-black tracking-[0.35em] uppercase text-xs">Experience</span>
            </div>
            {RESUME.experience.map((e, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10">
                <div className="flex-shrink-0 sm:w-36">
                  <span className="block text-[#ff4500]/50 font-black tracking-widest uppercase text-xs">{e.period}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                    <p className="text-white font-black uppercase tracking-tight text-xl md:text-2xl">{e.company}</p>
                    <p className="text-[#ff4500] font-bold italic text-sm">{e.role}</p>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-[#ff4500]/30 to-transparent mb-3" />
                  <ul className="flex flex-col gap-2">
                    {e.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-3">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#ff4500] shadow-[0_0_6px_#ff4500] flex-shrink-0" />
                        <span className="text-slate-300 uppercase font-medium tracking-wide text-xs md:text-sm leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* ── PROJECTS ROW ── */}
          <div className="px-6 md:px-10 py-6 border-b border-sky-400/10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_#7dd3fc] flex-shrink-0" />
              <span className="text-sky-400/70 font-black tracking-[0.35em] uppercase text-xs">Projects</span>
            </div>
            <div className="flex flex-col gap-6">
              {RESUME.projects.map((p, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10">
                  <div className="flex-shrink-0 sm:w-36">
                    <span className="block text-sky-400/50 font-black tracking-widest uppercase text-xs">{p.period}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                      <p className="text-white font-black uppercase tracking-tight text-lg md:text-xl">{p.title}</p>
                      <div className="flex flex-wrap gap-1">
                        {p.stack.map(s => <SkillPill key={s} label={s} />)}
                      </div>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-sky-400/30 to-transparent mb-2" />
                    <ul className="flex flex-col gap-1.5">
                      {p.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-3">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#7dd3fc] flex-shrink-0" />
                          <span className="text-slate-300 uppercase font-medium tracking-wide text-xs md:text-sm leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SKILLS ROW ── */}
          <div className="px-6 md:px-10 py-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_#7dd3fc] flex-shrink-0" />
              <span className="text-sky-400/70 font-black tracking-[0.35em] uppercase text-xs">Skills</span>
            </div>
            <div className="flex flex-col gap-4">
              {Object.entries(RESUME.skills).map(([cat, items]) => (
                <div key={cat} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                  <span className="flex-shrink-0 sm:w-36 text-sky-400/50 font-black tracking-widest uppercase text-xs">{cat}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(s => <SkillPill key={s} label={s} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#ff4500] via-sky-300 to-sky-400 shadow-[0_0_16px_#7dd3fc]" />
        </div>

        {/* ── CORNER BRACKETS ── */}
        <div className="absolute -top-1 -left-1 h-5 w-5 border-t-2 border-l-2 border-sky-400 shadow-[0_0_10px_#7dd3fc]" />
        <div className="absolute -top-1 -right-1 h-5 w-5 border-t-2 border-r-2 border-[#ff4500] shadow-[0_0_10px_#ff4500]" />
        <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-2 border-l-2 border-[#ff4500] shadow-[0_0_10px_#ff4500]" />
        <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-2 border-r-2 border-sky-400 shadow-[0_0_10px_#7dd3fc]" />

        {/* Download button */}
        <div className="flex justify-center mt-8">
          <a
            href="/resume.pdf"
            download
            className="resume-download-btn"
          >
            <span className="relative z-10 font-black uppercase tracking-[0.3em]"
                  style={{ fontSize: 'clamp(0.7rem, 1.5vw, 1rem)' }}>
              ↓ Download Resume
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function TronPortfolio() {
  const [activeSection, setActiveSection] = useState('home');

  const sections = [
    { id: 'home',       label: 'Home' },
    { id: 'aboutme',    label: 'About' },
    { id: 'skills',     label: 'Skills' },
    { id: 'experience', label: 'Exp' },
    { id: 'projects',   label: 'Projects' },
    { id: 'resume',     label: 'Resume' },
  ];

  useEffect(() => {
    const panel = document.getElementById('main-panel');
    if (!panel) return;

    const observerOptions = {
      root: panel,
      // Use a range of thresholds so we get accurate intersection ratios
      threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
    };

    // Track the section with the highest current intersectionRatio
    const ratios: Record<string, number> = {};

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        ratios[entry.target.id] = entry.intersectionRatio;
      });
      // Pick the section with the highest ratio
      const best = Object.entries(ratios).reduce(
        (acc, [id, ratio]) => (ratio > acc[1] ? [id, ratio] : acc),
        ['', 0]
      );
      if (best[1] > 0) setActiveSection(best[0]);
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="tron-grid relative h-screen w-full bg-[#010409] text-white overflow-hidden font-sans">

      {/* Nav sidebar grid background — fades into main content */}
      <div className="nav-grid-bg" />

      {/* Sidebar Nav */}
      <nav className="fixed left-0 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-5 md:gap-10 pl-2 md:pl-6">
        {sections.map((sec) => (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            onClick={e => { e.preventDefault(); handleNavClick(sec.id); }}
            className={`group relative flex items-center ${activeSection === sec.id ? 'nav-active' : ''}`}
          >
            <div className="nav-item-container">
              <div className="nav-trail" />
              <div className={`flex h-10 w-10 md:h-16 md:w-16 items-center justify-center rounded-full border-[3px] md:border-[5px] transition-all duration-500 ${activeSection === sec.id ? 'border-sky-300 shadow-[0_0_22px_#7dd3fc] bg-sky-500/20' : 'border-sky-500/10 bg-black hover:border-sky-400/40'}`}>
                <span className={`text-xs md:text-base font-black ${activeSection === sec.id ? 'text-white' : 'text-sky-200/60'}`}>{sec.label[0]}</span>
              </div>
              <span className="ml-3 md:ml-5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2 text-sky-300 font-black tracking-[0.2em] whitespace-nowrap text-xs md:text-sm">
                // {sec.label.toUpperCase()}
              </span>
            </div>
          </a>
        ))}
      </nav>

      <main id="main-panel" className="smooth-scroll relative ml-14 md:ml-28 lg:ml-40 h-screen overflow-y-auto bg-black/50 backdrop-blur-sm">

        {/* SECTION 1: HOME */}
        <section id="home" className="relative flex min-h-screen w-full items-center justify-between px-6 md:px-16 lg:px-24 overflow-hidden">
          <PixelRain opacity={0.5} />
          <div className="relative z-10 flex h-auto flex-col justify-center text-left">
            <p className="text-base md:text-2xl lg:text-4xl tracking-[0.4em] md:tracking-[0.6em] text-sky-400/30 uppercase font-bold mb-4 md:mb-6">My name is</p>
            <h1
              className="hollow-glow font-black uppercase tracking-tight leading-[0.85] mb-6 md:mb-10"
              style={{ fontSize: 'clamp(3rem, 9vw, 11rem)' }}
            >
              {['C','h','r','i','s','t','i','a','n'].map((l, i) => (
                <span key={i} className="home-letter" style={{ animationDelay: `${i * 0.09}s` }}>{l}</span>
              ))}
              <br />
              {['M','a','c','e','d','o'].map((l, i) => (
                <span key={i} className="home-letter" style={{ animationDelay: `${0.9 + i * 0.09}s` }}>{l}</span>
              ))}
            </h1>
            <div className="h-2 md:h-3 w-32 md:w-64 bg-sky-300 shadow-[0_0_25px_#7dd3fc] rounded-full" />
          </div>
          <div className="relative z-10 hidden sm:flex items-center justify-center mr-4 md:mr-12">
            <div className="disk-ring-glow absolute rounded-full border-[8px] md:border-[14px] border-sky-300/60"
                 style={{ width:'clamp(160px,25vw,480px)', height:'clamp(160px,25vw,480px)' }}/>
            <div className="relative border-[8px] md:border-[14px] border-sky-300 shadow-[0_0_30px_rgba(125,211,252,0.3)] rounded-full"
                 style={{ width:'clamp(120px,19vw,360px)', height:'clamp(120px,19vw,360px)' }}/>
          </div>
          <div className="neon-anchor-container">
            <div className="neon-anchor-circle" />
            <div className="neon-anchor-line" />
          </div>
        </section>

        {/* SECTION 2: ABOUT ME */}
        <section id="aboutme" className="relative flex min-h-screen w-full flex-col px-6 md:px-16 lg:px-24 pt-16 md:pt-20 pb-16 md:pb-20 overflow-hidden bg-[#010409]/80" style={{ minHeight: '100svh' }}>
          <PixelRain opacity={0.4} />
          <svg className="absolute inset-0 h-full w-full pointer-events-none z-[5]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline points="7,0 15,20 15,80 7,100" fill="none" stroke="#e0f2fe" strokeWidth="0.7" className="neon-line-strong" />
          </svg>
          <div className="relative z-10 mb-6 md:mb-8" style={{ marginLeft: 'clamp(60px, 18%, 22%)' }}>
            <h2 className="hollow-glow-gold font-black uppercase tracking-[0.1em]"
                style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>About Me</h2>
            <div className="h-1 md:h-1.5 w-40 md:w-80 bg-[#ff4500] shadow-[0_0_20px_#ff4500]" />
          </div>
          <div className="relative z-10 flex flex-col justify-center items-center flex-1 text-center" style={{ marginLeft: 'clamp(40px, 12%, 18%)', marginRight: '0' }}>
            <div className="flex flex-col gap-8 md:gap-16 lg:gap-24 max-w-3xl w-full">
              <div className="border-y border-sky-300/10 py-6 md:py-10 px-4 md:px-6">
                <p className="text-base md:text-xl lg:text-2xl leading-relaxed text-slate-400 font-medium uppercase tracking-wider">
                  A developer operating on the intersection of data engineering and distributed systems, committed to building high-performance architecture.
                  My work centers on scalable data pipelines, distributed coordination, and backend systems that transform complex data flows into reliable infrastructure.
                </p>
              </div>
              <div className="space-y-4 md:space-y-6">
                <p className="font-bold text-white tracking-tighter education-bubble"
                   style={{ fontSize:'clamp(1.5rem, 5vw, 3.75rem)' }}>
                  Texas A&amp;M University
                </p>
                <p className="text-[#ff4500] uppercase tracking-widest font-black drop-shadow-[0_0_15px_rgba(255,69,0,0.5)] education-bubble"
                   style={{ fontSize:'clamp(0.9rem, 2.5vw, 1.875rem)' }}>
                  B.S. Computer Science | Minor in Statistics
                </p>
                <p className="text-slate-500 font-bold italic education-bubble"
                   style={{ fontSize:'clamp(0.85rem, 2vw, 1.5rem)' }}>
                  Class of 2026 // GPA: 3.7 / 4.0
                </p>
              </div>
            </div>
          </div>
          <div className="neon-anchor-container">
            <div className="neon-anchor-circle" />
            <div className="neon-anchor-line" />
          </div>
        </section>

        {/* SECTION 3: SKILLS */}
        <section id="skills" className="relative flex min-h-screen w-full overflow-hidden bg-[#010409]/80" style={{ minHeight: '100svh' }}>
          <PixelRain opacity={0.35} />
          {/* Left sidebar: rotated "SKILLS" title */}
          <div className="relative z-10 flex-shrink-0 flex items-center justify-center" style={{ width: 'clamp(40px, 6vw, 80px)' }}>
            <div style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>
              <h2 className="hollow-glow-gold font-black uppercase tracking-[0.25em]" style={{ fontSize: 'clamp(1rem, 2.5vw, 2rem)' }}>Skills</h2>
            </div>
            {/* Vertical accent line */}
            <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#ff4500]/40 to-transparent" />
          </div>
          {/* Disk fills remaining space */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-4">
            <SkillsDisk />
          </div>
        </section>

        <ExperienceSection />
        <ProjectsSection />
        <ResumeSection />

      </main>
    </div>
  );
}