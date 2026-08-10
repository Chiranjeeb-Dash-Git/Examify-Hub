import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, BarChart3, Shield, BookOpen, Zap, Users } from 'lucide-react';

// ─── Per-slide Examify Hub feature content ────────────────────────────────────
const FEATURES = [
  {
    tag: 'SMART EXAMS',
    title: 'Timed Quiz\nAssessments',
    desc: 'Server-validated countdown timers, adaptive difficulty levels, and multi-format question banks — built for high-stakes evaluation.',
    stats: [{ label: 'Question Types', value: '6+' }, { label: 'Avg. Accuracy', value: '94%' }],
    icon: Clock,
    cta: 'Try a Quiz',
    ctaHref: '/quizzes',
  },
  {
    tag: 'LIVE ANALYTICS',
    title: 'Real-time\nLeaderboards',
    desc: 'Track scores, rank against peers, and visualise performance trends across every attempt with live recharts dashboards.',
    stats: [{ label: 'Metrics Tracked', value: '12' }, { label: 'Leaderboard', value: 'Live' }],
    icon: BarChart3,
    cta: 'View Rankings',
    ctaHref: '/leaderboard',
  },
  {
    tag: 'SECURE PLATFORM',
    title: 'Anti-cheat\nProctoring',
    desc: 'Tab-switch detection, server-side time verification, and role-based access control keep every exam fair and tamper-proof.',
    stats: [{ label: 'Uptime', value: '99.9%' }, { label: 'Auth Layers', value: '3' }],
    icon: Shield,
    cta: 'Learn More',
    ctaHref: '/register',
  },
  {
    tag: 'MULTI-ROLE',
    title: 'Admin &\nStudent Hub',
    desc: 'Full admin dashboard for creating categories, quizzes and questions. Students get a personalised dashboard with attempt history.',
    stats: [{ label: 'Roles', value: '2' }, { label: 'Dashboard Views', value: '8+' }],
    icon: Users,
    cta: 'Get Access',
    ctaHref: '/register',
  },
];

// ─── Image Data ──────────────────────────────────────────────────────────────
const IMAGES = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF' },
];

// ─── SVG Grain ────────────────────────────────────────────────────────────────
const GRAIN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E`;

// ─── Per-role positioning ─────────────────────────────────────────────────────
function getRoleStyle(role, isMobile) {
  const T = 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)';
  switch (role) {
    case 'center': return {
      position: 'absolute', aspectRatio: '0.6 / 1',
      left: '50%', bottom: isMobile ? '22%' : 0,
      height: isMobile ? '60%' : '92%',
      transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
      filter: 'blur(0px)', opacity: 1, zIndex: 20, transition: T, willChange: 'transform,filter,opacity',
    };
    case 'left': return {
      position: 'absolute', aspectRatio: '0.6 / 1',
      left: isMobile ? '20%' : '30%', bottom: isMobile ? '32%' : '12%',
      height: isMobile ? '16%' : '28%',
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(2px)', opacity: 0.85, zIndex: 10, transition: T, willChange: 'transform,filter,opacity',
    };
    case 'right': return {
      position: 'absolute', aspectRatio: '0.6 / 1',
      left: isMobile ? '80%' : '70%', bottom: isMobile ? '32%' : '12%',
      height: isMobile ? '16%' : '28%',
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(2px)', opacity: 0.85, zIndex: 10, transition: T, willChange: 'transform,filter,opacity',
    };
    default: return {
      position: 'absolute', aspectRatio: '0.6 / 1',
      left: '50%', bottom: isMobile ? '32%' : '12%',
      height: isMobile ? '13%' : '22%',
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(4px)', opacity: 1, zIndex: 5, transition: T, willChange: 'transform,filter,opacity',
    };
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ToonHubCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [textVisible, setTextVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Use a ref for the animation lock so navigate() stays stable
  const isAnimatingRef = useRef(false);
  const animLockRef = useRef(null);
  const autoRef = useRef(null);
  const pauseRef = useRef(null);
  const isPausedRef = useRef(false);

  // Preload images
  useEffect(() => {
    IMAGES.forEach(({ src }) => { const i = new Image(); i.src = src; });
  }, []);

  // Resize listener
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // ── Core navigation ─────────────────────────────────────────────────────────
  // navigate has EMPTY deps — isAnimatingRef avoids stale closure issues
  const navigate = useCallback((direction, isAuto = false) => {
    if (isAnimatingRef.current) return;

    if (!isAuto) {
      // manual click: pause auto-play for 6 s then resume
      isPausedRef.current = true;
      setIsPaused(true);
      clearTimeout(pauseRef.current);
      pauseRef.current = setTimeout(() => {
        isPausedRef.current = false;
        setIsPaused(false);
      }, 6000);
    }

    isAnimatingRef.current = true;
    setTextVisible(false);
    setActiveIndex(prev => direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4);

    clearTimeout(animLockRef.current);
    animLockRef.current = setTimeout(() => {
      isAnimatingRef.current = false;
      setTextVisible(true);
    }, 650);
  }, []); // stable — no state deps

  // ── Auto-advance every 3 s ───────────────────────────────────────────────────
  // navigate is stable (empty deps), so this effect runs exactly once on mount
  useEffect(() => {
    autoRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        navigate('next', true);
      }
    }, 3000);
    return () => clearInterval(autoRef.current);
  }, [navigate]); // navigate is stable → interval never resets

  // Cleanup on unmount
  useEffect(() => () => {
    clearTimeout(animLockRef.current);
    clearTimeout(pauseRef.current);
    clearInterval(autoRef.current);
  }, []);

  // Derived roles
  const center = activeIndex;
  const left   = (activeIndex + 3) % 4;
  const right  = (activeIndex + 1) % 4;
  const roleOf = i => i === center ? 'center' : i === left ? 'left' : i === right ? 'right' : 'back';

  const feature = FEATURES[activeIndex];
  const FeatureIcon = feature.icon;

  return (
    <div
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'Inter', sans-serif",
      }}
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { clearTimeout(pauseRef.current); setIsPaused(false); }}
    >
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>

        {/* ── Grain overlay ── */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          zIndex: 50, opacity: 0.4,
          backgroundImage: `url("${GRAIN_SVG}")`,
          backgroundSize: '200px 200px', backgroundRepeat: 'repeat',
        }} />

        {/* ── Progress dots ── */}
        <div style={{
          position: 'absolute', top: '1.5rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: '0.5rem', zIndex: 60,
        }}>
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === activeIndex || isAnimating) return;
                const dir = (i - activeIndex + 4) % 4 <= 2 ? 'next' : 'prev';
                setIsPaused(true);
                clearTimeout(pauseRef.current);
                pauseRef.current = setTimeout(() => setIsPaused(false), 6000);
                setTextVisible(false);
                setIsAnimating(true);
                setActiveIndex(i);
                clearTimeout(animLockRef.current);
                animLockRef.current = setTimeout(() => { setIsAnimating(false); setTextVisible(true); }, 650);
              }}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === activeIndex ? '2rem' : '0.5rem',
                height: '0.5rem',
                borderRadius: '9999px',
                background: i === activeIndex ? 'white' : 'rgba(255,255,255,0.45)',
                border: 'none',
                cursor: 'pointer',
                transition: 'width 400ms cubic-bezier(0.4,0,0.2,1), background 400ms',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* ── Carousel images ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          {IMAGES.map((img, index) => (
            <div key={index} style={getRoleStyle(roleOf(index), isMobile)}>
              <img
                src={img.src}
                alt=""
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }}
              />
            </div>
          ))}
        </div>

        {/* ── Feature text panel — bottom-left ── */}
        <div
          style={{
            position: 'absolute',
            bottom: isMobile ? '5.5rem' : '4rem',
            left: isMobile ? '1rem' : '4rem',
            zIndex: 60,
            maxWidth: isMobile ? 'calc(100% - 2rem)' : '380px',
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 400ms ease, transform 400ms ease',
          }}
        >
          {/* Tag chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            borderRadius: '9999px',
            padding: '0.25rem 0.75rem',
            marginBottom: '0.75rem',
          }}>
            <FeatureIcon size={12} color="white" strokeWidth={2.5} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'white', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {feature.tag}
            </span>
          </div>

          {/* Main title */}
          <h2
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: isMobile ? 'clamp(28px, 8vw, 42px)' : 'clamp(36px, 5vw, 62px)',
              fontWeight: 400,
              color: 'white',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
              whiteSpace: 'pre-line',
            }}
          >
            {feature.title}
          </h2>

          {/* Description — desktop only */}
          {!isMobile && (
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.65,
              marginBottom: '1.1rem',
              maxWidth: '320px',
            }}>
              {feature.desc}
            </p>
          )}

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
            {feature.stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: isMobile ? '1.1rem' : '1.4rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Nav buttons row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => navigate('prev')}
              aria-label="Previous"
              style={{
                width: isMobile ? '2.75rem' : '3.5rem', height: isMobile ? '2.75rem' : '3.5rem',
                borderRadius: '9999px', background: 'transparent',
                border: '2px solid rgba(255,255,255,0.8)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'transform 150ms, background-color 150ms', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <ArrowLeft size={22} strokeWidth={2.25} />
            </button>

            <button
              onClick={() => navigate('next')}
              aria-label="Next"
              style={{
                width: isMobile ? '2.75rem' : '3.5rem', height: isMobile ? '2.75rem' : '3.5rem',
                borderRadius: '9999px', background: 'transparent',
                border: '2px solid rgba(255,255,255,0.8)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'transform 150ms, background-color 150ms', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <ArrowRight size={22} strokeWidth={2.25} />
            </button>

            {/* CTA button */}
            <Link
              to={feature.ctaHref}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: isMobile ? '0.55rem 1rem' : '0.65rem 1.25rem',
                borderRadius: '9999px',
                background: 'white', color: IMAGES[activeIndex].bg,
                fontWeight: 700, fontSize: isMobile ? '0.7rem' : '0.78rem',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'transform 150ms, opacity 150ms',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.opacity = '0.92'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
            >
              {feature.cta}
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* ── "DISCOVER IT" — bottom right ── */}
        <Link
          to="/login"
          style={{
            position: 'absolute',
            bottom: isMobile ? '1.5rem' : '4rem',
            right: isMobile ? '1rem' : '3rem',
            zIndex: 60,
            display: 'flex', alignItems: 'center',
            gap: isMobile ? '0.3rem' : '0.5rem',
            fontFamily: "'Anton', sans-serif",
            fontSize: isMobile ? 'clamp(16px, 4vw, 24px)' : 'clamp(20px, 3vw, 42px)',
            fontWeight: 400, color: 'white', opacity: 0.9,
            letterSpacing: '-0.02em', lineHeight: 1,
            textTransform: 'uppercase', textDecoration: 'none',
            transition: 'opacity 200ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.9')}
        >
          EXPLORE
          <ArrowRight style={{ width: isMobile ? '1rem' : '1.6rem', height: isMobile ? '1rem' : '1.6rem' }} strokeWidth={2.25} />
        </Link>

      </div>
    </div>
  );
}

export default ToonHubCarousel;
