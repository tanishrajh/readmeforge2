import { useEffect, useRef, useCallback } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

/* ── Bezier math ───────────────────────────────────── */
function bz(p0, p1, p2, p3, t) {
  const m = 1 - t;
  return {
    x: m*m*m*p0.x + 3*m*m*t*p1.x + 3*m*t*t*p2.x + t*t*t*p3.x,
    y: m*m*m*p0.y + 3*m*m*t*p1.y + 3*m*t*t*p2.y + t*t*t*p3.y,
  };
}

function bzTan(p0, p1, p2, p3, t) {
  const m = 1 - t;
  return {
    x: 3*m*m*(p1.x-p0.x) + 6*m*t*(p2.x-p1.x) + 3*t*t*(p3.x-p2.x),
    y: 3*m*m*(p1.y-p0.y) + 6*m*t*(p2.y-p1.y) + 3*t*t*(p3.y-p2.y),
  };
}

function norm(v) {
  const l = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / l, y: v.y / l };
}

function lerpRGBA(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    a[3] + (b[3] - a[3]) * t,
  ];
}

function rgbaStr([r, g, b, a]) {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a.toFixed(3)})`;
}

/* ── Ribbon centerline — relative coords (0-1) ──── */
const SEGS = [
  // Enter from left edge, below hero
  [{ x:-0.08, y:0.24 }, { x:0.12, y:0.21 }, { x:0.35, y:0.28 }, { x:0.58, y:0.33 }],
  // Sweep right then arc back
  [{ x:0.58, y:0.33 }, { x:0.81, y:0.38 }, { x:0.95, y:0.45 }, { x:0.78, y:0.51 }],
  // Wide arc flowing back left
  [{ x:0.78, y:0.51 }, { x:0.61, y:0.57 }, { x:0.10, y:0.55 }, { x:0.18, y:0.63 }],
  // Turn right again
  [{ x:0.18, y:0.63 }, { x:0.26, y:0.71 }, { x:0.86, y:0.69 }, { x:0.80, y:0.77 }],
  // Sweep left
  [{ x:0.80, y:0.77 }, { x:0.74, y:0.85 }, { x:0.20, y:0.86 }, { x:0.35, y:0.91 }],
  // Exit to right edge
  [{ x:0.35, y:0.91 }, { x:0.50, y:0.96 }, { x:0.85, y:0.95 }, { x:1.08, y:0.94 }],
];

const N = 30;          // samples per bezier segment
const HW = 30;         // half-width of ribbon in px
const TWISTS = 3;      // number of full 360° twists

const LABELS = [
  { t: 0.10, text: 'README GENERATOR' },
  { t: 0.25, text: 'LIVE PREVIEW' },
  { t: 0.42, text: '8+ TEMPLATES' },
  { t: 0.58, text: 'AUTO-SAVE' },
  { t: 0.74, text: 'QUALITY SCORE' },
  { t: 0.90, text: 'OPEN SOURCE' },
];

/* ── Component ──────────────────────────────────── */
export default function ScrollRibbon() {
  const canvasRef = useRef(null);
  const ptsRef = useRef(null);
  const progRef = useRef(0);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const { scrollYProgress } = useScroll();
  // Map page scroll → ribbon draw progress
  const ribbonProg = useTransform(scrollYProgress, [0.08, 0.92], [0, 1]);

  /* ── Precompute ribbon sample points ─────────── */
  const compute = useCallback((w, h) => {
    const total = SEGS.length * N;
    const pts = [];

    for (let s = 0; s < SEGS.length; s++) {
      const [p0, p1, p2, p3] = SEGS[s];
      for (let i = 0; i < N; i++) {
        const lt = i / N;
        const gt = (s * N + i) / total;
        const sc = (n) => ({ x: n.x * w, y: n.y * h });
        const pt = bz(sc(p0), sc(p1), sc(p2), sc(p3), lt);
        const tn = norm(bzTan(sc(p0), sc(p1), sc(p2), sc(p3), lt));
        const perp = { x: -tn.y, y: tn.x };
        const twist = gt * Math.PI * 2 * TWISTS;
        const cosT = Math.cos(twist);

        pts.push({
          cx: pt.x, cy: pt.y,
          px: perp.x, py: perp.y,
          cosT,
          hw: HW * cosT,
          angle: Math.atan2(tn.y, tn.x),
          gt,
        });
      }
    }
    ptsRef.current = pts;
  }, []);

  /* ── Draw the ribbon ──────────────────────────── */
  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    const pts = ptsRef.current;
    if (!cvs || !pts || pts.length < 2) return;

    const ctx = cvs.getContext('2d');
    const prog = progRef.current;
    const last = Math.floor(prog * (pts.length - 1));
    const isDark = themeRef.current === 'dark';

    ctx.clearRect(0, 0, cvs.width, cvs.height);
    if (last < 1) return;

    // Color palettes [R, G, B, A]
    const front = isDark ? [111, 168, 201, 0.55] : [75, 140, 180, 0.35];
    const back  = isDark ? [30,  65,  90, 0.55]  : [45,  80, 110, 0.25];
    const edgeF = isDark ? [170, 215, 240, 0.40] : [130, 190, 225, 0.30];
    const edgeB = isDark ? [60,  95, 125, 0.25]  : [55,  90, 120, 0.15];
    const txtC  = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(20,50,70,0.5)';

    // ── Shadow pass (offset, low-opacity, no blur) ──
    ctx.globalAlpha = isDark ? 0.10 : 0.05;
    for (let i = 1; i <= last; i++) {
      const p = pts[i - 1], c = pts[i];
      const ox = 4, oy = 6;
      ctx.beginPath();
      ctx.moveTo(p.cx + p.px * p.hw * 1.1 + ox, p.cy + p.py * p.hw * 1.1 + oy);
      ctx.lineTo(c.cx + c.px * c.hw * 1.1 + ox, c.cy + c.py * c.hw * 1.1 + oy);
      ctx.lineTo(c.cx - c.px * c.hw * 1.1 + ox, c.cy - c.py * c.hw * 1.1 + oy);
      ctx.lineTo(p.cx - p.px * p.hw * 1.1 + ox, p.cy - p.py * p.hw * 1.1 + oy);
      ctx.closePath();
      ctx.fillStyle = isDark ? '#000' : '#2a4a60';
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── Main ribbon quads ──
    for (let i = 1; i <= last; i++) {
      const p = pts[i - 1], c = pts[i];
      // Smooth color blend: cosT ∈ [-1,1] → t ∈ [0,1]
      const t = (c.cosT + 1) / 2;
      const fill = rgbaStr(lerpRGBA(back, front, t));
      const edge = rgbaStr(lerpRGBA(edgeB, edgeF, t));

      // Filled quad
      ctx.beginPath();
      ctx.moveTo(p.cx + p.px * p.hw, p.cy + p.py * p.hw);
      ctx.lineTo(c.cx + c.px * c.hw, c.cy + c.py * c.hw);
      ctx.lineTo(c.cx - c.px * c.hw, c.cy - c.py * c.hw);
      ctx.lineTo(p.cx - p.px * p.hw, p.cy - p.py * p.hw);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();

      // Top-edge specular highlight
      ctx.beginPath();
      ctx.moveTo(p.cx + p.px * p.hw, p.cy + p.py * p.hw);
      ctx.lineTo(c.cx + c.px * c.hw, c.cy + c.py * c.hw);
      ctx.strokeStyle = edge;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bottom-edge subtle line
      ctx.beginPath();
      ctx.moveTo(p.cx - p.px * p.hw, p.cy - p.py * p.hw);
      ctx.lineTo(c.cx - c.px * c.hw, c.cy - c.py * c.hw);
      ctx.strokeStyle = rgbaStr(lerpRGBA(edgeB, edgeF, t * 0.5));
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // ── Text labels along the ribbon ──
    ctx.font = '600 11px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const lb of LABELS) {
      const idx = Math.floor(lb.t * (pts.length - 1));
      if (idx > last) continue;
      const pt = pts[idx];
      // Skip text when ribbon is nearly edge-on
      if (Math.abs(pt.cosT) < 0.35) continue;

      ctx.save();
      ctx.translate(pt.cx, pt.cy);
      let a = pt.angle;
      // Flip if text would be upside-down
      if (a > Math.PI / 2 || a < -Math.PI / 2) a += Math.PI;
      ctx.rotate(a);
      ctx.fillStyle = txtC;
      ctx.fillText(lb.text, 0, 0);
      ctx.restore();
    }
  }, []);

  /* ── Lifecycle: resize, compute, draw ──────────── */
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    const resize = () => {
      const parent = cvs.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      if (w === 0 || h === 0) return;

      cvs.width = w * dpr;
      cvs.height = h * dpr;
      cvs.style.width = w + 'px';
      cvs.style.height = h + 'px';
      cvs.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      compute(w, h);
      draw();
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [compute, draw]);

  // Redraw on theme change
  useEffect(() => { draw(); }, [theme, draw]);

  // Scroll-linked progressive drawing
  useMotionValueEvent(ribbonProg, 'change', (v) => {
    progRef.current = Math.max(0, Math.min(1, v));
    draw();
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
