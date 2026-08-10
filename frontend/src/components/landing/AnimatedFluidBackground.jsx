import React, { useEffect, useRef } from 'react';

/**
 * AnimatedFluidBackground
 * Crystal-clear dark ribbon animation matching the reference design:
 * - Pure black base
 * - Dark navy/blue 3D-looking ribbon shapes
 * - Bright specular highlights for the "metallic silk" look
 * - Clearly visible animation (~8–14 second cycle per shape)
 */
export const AnimatedFluidBackground = () => {
  const canvasRef = useRef(null);
  const animRef  = useRef(null);
  const tRef     = useRef(0); // use ref so resize doesn't reset frame

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width  = W * (window.devicePixelRatio || 1);
      canvas.height = H * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize);

    /* ─────────────────────────────────────────────────────────
       Ribbon shapes — each defined by a set of control points
       that oscillate independently to create organic motion.

       Speed: ~0.008–0.014 rad/frame  →  visible 7–13s cycle
       (previous bug: speeds were ~0.00023 = 45× too slow)
    ───────────────────────────────────────────────────────── */
    const ribbons = [
      // Ribbon 1 — sweeping main dark-navy shape (top-left to bottom-right)
      {
        pts: [
          { bx: 0.00, by: 0.55, px: 0.00, py: 0.70, sx: 0.0088, sy: 0.0072, ax: 0.10, ay: 0.12 },
          { bx: 0.15, by: 0.10, px: 1.20, py: 2.40, sx: 0.0095, sy: 0.0081, ax: 0.12, ay: 0.09 },
          { bx: 0.45, by: 0.20, px: 2.40, py: 1.20, sx: 0.0073, sy: 0.0097, ax: 0.14, ay: 0.11 },
          { bx: 0.75, by: 0.05, px: 3.60, py: 4.80, sx: 0.0110, sy: 0.0065, ax: 0.09, ay: 0.13 },
          { bx: 1.00, by: 0.30, px: 4.80, py: 0.60, sx: 0.0083, sy: 0.0108, ax: 0.11, ay: 0.08 },
          { bx: 0.90, by: 0.70, px: 6.00, py: 3.60, sx: 0.0096, sy: 0.0077, ax: 0.10, ay: 0.14 },
          { bx: 0.55, by: 0.90, px: 7.20, py: 2.40, sx: 0.0068, sy: 0.0093, ax: 0.13, ay: 0.09 },
          { bx: 0.20, by: 0.85, px: 8.40, py: 5.60, sx: 0.0104, sy: 0.0070, ax: 0.08, ay: 0.12 },
        ],
        // Dark navy to mid-blue (reference ribbon color)
        grad: { c0: '#020214', c1: '#0a0838', c2: '#18126a', c3: '#0e0a50' },
        alpha: 1.0,
        blend: 'source-over',
      },

      // Ribbon 2 — secondary ribbon (diagonal from bottom-left to top-right)
      {
        pts: [
          { bx: 0.00, by: 0.90, px: 0.50, py: 1.50, sx: 0.0076, sy: 0.0091, ax: 0.11, ay: 0.10 },
          { bx: 0.25, by: 0.60, px: 2.00, py: 0.80, sx: 0.0099, sy: 0.0068, ax: 0.13, ay: 0.12 },
          { bx: 0.55, by: 0.40, px: 3.50, py: 5.00, sx: 0.0084, sy: 0.0105, ax: 0.10, ay: 0.09 },
          { bx: 0.80, by: 0.15, px: 5.00, py: 2.50, sx: 0.0112, sy: 0.0078, ax: 0.09, ay: 0.13 },
          { bx: 1.05, by: 0.00, px: 6.50, py: 4.00, sx: 0.0071, sy: 0.0096, ax: 0.12, ay: 0.08 },
          { bx: 0.85, by: 0.50, px: 8.00, py: 1.50, sx: 0.0093, sy: 0.0083, ax: 0.10, ay: 0.11 },
          { bx: 0.40, by: 0.80, px: 9.50, py: 6.50, sx: 0.0079, sy: 0.0107, ax: 0.11, ay: 0.09 },
        ],
        grad: { c0: '#05031a', c1: '#120d4a', c2: '#201878', c3: '#160f58' },
        alpha: 0.92,
        blend: 'screen',
      },

      // Ribbon 3 — accent ribbon with purple hue (right side sweep)
      {
        pts: [
          { bx: 0.60, by: 0.00, px: 1.00, py: 3.00, sx: 0.0102, sy: 0.0075, ax: 0.10, ay: 0.10 },
          { bx: 0.90, by: 0.25, px: 2.50, py: 1.50, sx: 0.0078, sy: 0.0099, ax: 0.12, ay: 0.08 },
          { bx: 1.00, by: 0.55, px: 4.00, py: 6.00, sx: 0.0095, sy: 0.0082, ax: 0.08, ay: 0.13 },
          { bx: 0.70, by: 0.80, px: 5.50, py: 2.50, sx: 0.0113, sy: 0.0069, ax: 0.11, ay: 0.09 },
          { bx: 0.40, by: 0.95, px: 7.00, py: 4.50, sx: 0.0086, sy: 0.0104, ax: 0.09, ay: 0.11 },
          { bx: 0.55, by: 0.60, px: 8.50, py: 0.80, sx: 0.0074, sy: 0.0091, ax: 0.13, ay: 0.08 },
        ],
        grad: { c0: '#08043a', c1: '#1a0d60', c2: '#2e1890', c3: '#220e70' },
        alpha: 0.88,
        blend: 'screen',
      },

      // Ribbon 4 — bright specular ribbon (creates the highlight from reference)
      {
        pts: [
          { bx: 0.10, by: 0.30, px: 2.00, py: 5.00, sx: 0.0118, sy: 0.0086, ax: 0.14, ay: 0.08 },
          { bx: 0.35, by: 0.05, px: 3.50, py: 1.00, sx: 0.0082, sy: 0.0112, ax: 0.10, ay: 0.12 },
          { bx: 0.65, by: 0.15, px: 5.00, py: 7.00, sx: 0.0096, sy: 0.0077, ax: 0.12, ay: 0.09 },
          { bx: 0.85, by: 0.40, px: 6.50, py: 3.00, sx: 0.0071, sy: 0.0103, ax: 0.09, ay: 0.13 },
          { bx: 0.60, by: 0.65, px: 8.00, py: 5.50, sx: 0.0105, sy: 0.0078, ax: 0.11, ay: 0.08 },
          { bx: 0.25, by: 0.55, px: 9.50, py: 2.00, sx: 0.0089, sy: 0.0094, ax: 0.10, ay: 0.11 },
        ],
        grad: { c0: '#1a1060', c1: '#3020a0', c2: '#5535d0', c3: '#2818b0' },
        alpha: 0.75,
        blend: 'screen',
      },
    ];

    /* ── Draw one smooth closed ribbon shape ─────────────────── */
    const drawRibbon = (pts) => {
      const n = pts.length;
      if (n < 3) return;

      ctx.beginPath();
      // Midpoint between last and first for smooth closure
      const start = {
        x: (pts[n - 1].x + pts[0].x) / 2,
        y: (pts[n - 1].y + pts[0].y) / 2,
      };
      ctx.moveTo(start.x, start.y);

      for (let i = 0; i < n; i++) {
        const cur  = pts[i];
        const next = pts[(i + 1) % n];
        const mid  = { x: (cur.x + next.x) / 2, y: (cur.y + next.y) / 2 };
        ctx.quadraticBezierTo
          ? ctx.quadraticBezierTo(cur.x, cur.y, mid.x, mid.y)
          : ctx.quadraticCurveTo(cur.x, cur.y, mid.x, mid.y);
      }

      ctx.closePath();
    };

    /* ── Build gradient for a ribbon ────────────────────────── */
    const hexToRgb = (hex) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    });

    const ribbonGradient = (pts, g, alpha) => {
      if (!W || !H) return 'black';
      const xs = pts.map(p => p.x);
      const ys = pts.map(p => p.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      const cx   = (minX + maxX) / 2;
      const cy   = (minY + maxY) / 2;
      const rr   = Math.max(maxX - minX, maxY - minY) * 0.6;

      const grad = ctx.createRadialGradient(cx, cy * 0.6, rr * 0.02, cx, cy, rr);

      const a = (hex, a2) => {
        const { r, g: gv, b } = hexToRgb(hex);
        return `rgba(${r},${gv},${b},${(a2 * alpha).toFixed(3)})`;
      };
      grad.addColorStop(0,    a(g.c2, 1.0));   // bright center
      grad.addColorStop(0.30, a(g.c1, 0.98));  // main body
      grad.addColorStop(0.65, a(g.c0, 0.95));  // deeper
      grad.addColorStop(1,    a(g.c3, 0.80));  // edge — still opaque
      return grad;
    };

    /* ── Main render loop ────────────────────────────────────── */
    const draw = () => {
      const t = ++tRef.current;

      // Pure-black base
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      ribbons.forEach((rib) => {
        // Compute animated pixel positions for each control point
        const pts = rib.pts.map(pt => ({
          x: (pt.bx + Math.sin(t * pt.sx + pt.px) * pt.ax) * W,
          y: (pt.by + Math.cos(t * pt.sy + pt.py) * pt.ay) * H,
        }));

        ctx.globalCompositeOperation = rib.blend;
        drawRibbon(pts);

        ctx.fillStyle = ribbonGradient(pts, rib.grad, rib.alpha);
        ctx.fill();

        // ── Specular highlight streak along top edge of each ribbon ──
        // A thinner bright shape offset upward for the 3D metallic look
        const specPts = pts.map((p, i) => ({
          x: p.x + Math.sin(i * 1.3) * W * 0.02,
          y: p.y - H * 0.04 - Math.sin(i * 0.9) * H * 0.015,
        }));

        drawRibbon(specPts);

        const specGrad = ctx.createLinearGradient(0, 0, W, H);
        specGrad.addColorStop(0,   `rgba(160,130,255,${0.18 * rib.alpha})`);
        specGrad.addColorStop(0.4, `rgba(100, 80,220,${0.12 * rib.alpha})`);
        specGrad.addColorStop(1,   `rgba( 60, 40,180,${0.06 * rib.alpha})`);
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = specGrad;
        ctx.fill();
      });

      // ── Top-right bright specular orb (from reference image) ──────
      ctx.globalCompositeOperation = 'screen';
      const orbX = (0.72 + Math.sin(t * 0.0082) * 0.08) * W;
      const orbY = (0.08 + Math.cos(t * 0.0094) * 0.05) * H;
      const orbR = 0.22 * Math.min(W, H);
      const orb  = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbR);
      orb.addColorStop(0,   'rgba(140,110,255,0.40)');
      orb.addColorStop(0.4, 'rgba( 80, 60,200,0.14)');
      orb.addColorStop(1,   'rgba( 40, 20,150,0.00)');
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
      ctx.fillStyle = orb;
      ctx.fill();

      // ── Reset composite ────────────────────────────────────────────
      ctx.globalCompositeOperation = 'source-over';

      // ── Cinematic dark vignette ────────────────────────────────────
      const vig = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
      vig.addColorStop(0,    'rgba(0,0,0,0.00)');
      vig.addColorStop(0.50, 'rgba(0,0,0,0.08)');
      vig.addColorStop(0.80, 'rgba(0,0,0,0.50)');
      vig.addColorStop(1,    'rgba(0,0,0,0.82)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // ── Bottom readability fade ────────────────────────────────────
      const fade = ctx.createLinearGradient(0, H * 0.45, 0, H);
      fade.addColorStop(0, 'rgba(0,0,0,0.00)');
      fade.addColorStop(1, 'rgba(0,0,0,0.88)');
      ctx.fillStyle = fade;
      ctx.fillRect(0, H * 0.45, W, H);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, filter: 'blur(100px)', opacity: 0.65 }}
      aria-hidden="true"
    />
  );
};
