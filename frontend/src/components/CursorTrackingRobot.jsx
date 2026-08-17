import React, { useEffect, useRef, useState } from 'react';

/**
 * CursorTrackingRobot — an SVG robot whose eyes follow the mouse cursor.
 * Drop it anywhere; pass `size` (px) to scale.
 */
export function CursorTrackingRobot({ size = 200 }) {
  const svgRef = useRef(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  /* ── cursor tracking ── */
  useEffect(() => {
    const onMove = (e) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.36; // eye-line
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const maxMove = 5;
      setEyeOffset({
        x: (dx / dist) * Math.min(maxMove, dist * 0.02),
        y: (dy / dist) * Math.min(maxMove, dist * 0.02),
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /* ── random blink ── */
  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 2800 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);

  const eyeH = blink ? 1 : 10;
  const eyeRy = blink ? 0.5 : 5;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 120 140"
      width={size}
      height={size}
      style={{ display: 'block', filter: 'drop-shadow(0 0 18px rgba(34,211,238,.25))' }}
    >
      {/* ── Antenna ── */}
      <line x1="60" y1="18" x2="60" y2="6" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="4" r="3" fill="#22d3ee">
        <animate attributeName="opacity" values="1;.3;1" dur="1.8s" repeatCount="indefinite" />
      </circle>

      {/* ── Head ── */}
      <rect x="30" y="18" width="60" height="44" rx="12" ry="12"
            fill="url(#headGrad)" stroke="#22d3ee" strokeWidth="1.5" />

      {/* ── Visor ── */}
      <rect x="36" y="28" width="48" height="24" rx="8" ry="8"
            fill="#0a0a0d" stroke="rgba(34,211,238,.3)" strokeWidth="1" />

      {/* ── Left Eye ── */}
      <ellipse
        cx={50 + eyeOffset.x}
        cy={40 + eyeOffset.y}
        rx="5"
        ry={eyeRy}
        fill="#22d3ee"
      >
        <animate attributeName="opacity" values="1;.7;1" dur="2s" repeatCount="indefinite" />
      </ellipse>

      {/* ── Right Eye ── */}
      <ellipse
        cx={70 + eyeOffset.x}
        cy={40 + eyeOffset.y}
        rx="5"
        ry={eyeRy}
        fill="#a855f7"
      >
        <animate attributeName="opacity" values="1;.7;1" dur="2s" repeatCount="indefinite" begin="0.3s" />
      </ellipse>

      {/* ── Mouth ── */}
      <rect x="48" y="50" width="24" height="3" rx="1.5" fill="rgba(34,211,238,.25)" />

      {/* ── Ear connectors ── */}
      <rect x="22" y="32" width="8" height="16" rx="3" fill="url(#headGrad)" stroke="#22d3ee" strokeWidth="1" />
      <rect x="90" y="32" width="8" height="16" rx="3" fill="url(#headGrad)" stroke="#a855f7" strokeWidth="1" />

      {/* ── Neck ── */}
      <rect x="52" y="62" width="16" height="8" rx="3" fill="#18181b" stroke="rgba(255,255,255,.08)" strokeWidth="1" />

      {/* ── Body ── */}
      <rect x="28" y="70" width="64" height="48" rx="10" ry="10"
            fill="url(#bodyGrad)" stroke="rgba(34,211,238,.2)" strokeWidth="1.5" />

      {/* ── Chest panel ── */}
      <rect x="40" y="78" width="40" height="20" rx="4" fill="#0a0a0d" stroke="rgba(34,211,238,.15)" strokeWidth="1" />
      {/* Chest lights */}
      <circle cx="50" cy="88" r="2.5" fill="#22d3ee">
        <animate attributeName="opacity" values="1;.2;1" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="88" r="2.5" fill="#fbbf24">
        <animate attributeName="opacity" values="1;.2;1" dur="1.2s" repeatCount="indefinite" begin="0.4s" />
      </circle>
      <circle cx="70" cy="88" r="2.5" fill="#a855f7">
        <animate attributeName="opacity" values="1;.2;1" dur="1.2s" repeatCount="indefinite" begin="0.8s" />
      </circle>

      {/* ── Arms ── */}
      <rect x="14" y="74" width="14" height="32" rx="6" fill="url(#headGrad)" stroke="rgba(34,211,238,.15)" strokeWidth="1" />
      <rect x="92" y="74" width="14" height="32" rx="6" fill="url(#headGrad)" stroke="rgba(168,85,247,.15)" strokeWidth="1" />
      {/* Hands */}
      <circle cx="21" cy="108" r="5" fill="#18181b" stroke="rgba(34,211,238,.3)" strokeWidth="1" />
      <circle cx="99" cy="108" r="5" fill="#18181b" stroke="rgba(168,85,247,.3)" strokeWidth="1" />

      {/* ── Legs ── */}
      <rect x="38" y="118" width="14" height="16" rx="4" fill="url(#headGrad)" stroke="rgba(34,211,238,.15)" strokeWidth="1" />
      <rect x="68" y="118" width="14" height="16" rx="4" fill="url(#headGrad)" stroke="rgba(168,85,247,.15)" strokeWidth="1" />
      {/* Feet */}
      <rect x="34" y="132" width="22" height="6" rx="3" fill="#18181b" stroke="rgba(34,211,238,.2)" strokeWidth="1" />
      <rect x="64" y="132" width="22" height="6" rx="3" fill="#18181b" stroke="rgba(168,85,247,.2)" strokeWidth="1" />

      {/* ── Gradients ── */}
      <defs>
        <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1e22" />
          <stop offset="100%" stopColor="#111113" />
        </linearGradient>
      </defs>
    </svg>
  );
}
