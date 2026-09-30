import { useEffect, useRef } from 'react';

/**
 * Animated "video -> transcript -> embeddings -> FAISS -> LLM -> knowledge"
 * pipeline rendered on a single canvas. GPU-light: one rAF loop, DPR-capped,
 * pauses when offscreen/hidden, renders one static frame under reduced motion.
 */
export default function HeroCanvas() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0, raf = 0, running = true, visible = true;
    const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 };

    const INPUTS = ['VIDEO', 'TRANSCRIPT', 'EMBEDDINGS', 'FAISS'];
    const OUTPUTS = ['SUMMARY', 'QUIZ', 'CHAT'];

    // Cubic bezier control points (normalized) carrying the input chain
    const B = [
      { x: 0.04, y: 0.82 }, { x: 0.24, y: 0.08 },
      { x: 0.40, y: 0.98 }, { x: 0.585, y: 0.52 },
    ];
    const bez = (t) => {
      const u = 1 - t;
      return {
        x: u * u * u * B[0].x + 3 * u * u * t * B[1].x + 3 * u * t * t * B[2].x + t * t * t * B[3].x,
        y: u * u * u * B[0].y + 3 * u * u * t * B[1].y + 3 * u * t * t * B[2].y + t * t * t * B[3].y,
      };
    };

    let particles = [];
    const initParticles = () => {
      particles = [];
      INPUTS.forEach((_, i) => {
        const n = 3;
        for (let j = 0; j < n; j++) {
          particles.push({ seg: i, t: (j + Math.random()) / n, speed: 0.35 + Math.random() * 0.25 });
        }
      });
    };
    initParticles();

    let outputFlashes = OUTPUTS.map(() => 0);
    let rings = []; // { r, alpha }
    let emitTimer = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const layout = () => {
      const cx = W * 0.585, cy = H * 0.52;
      const pts = [0.02, 0.3, 0.58, 0.86].map(bez).map((p) => ({ x: p.x * W, y: p.y * H }));
      const outR = Math.min(W * 0.27, 165);
      const outs = [-36, 0, 36].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return { x: cx + outR * Math.cos(rad), y: cy + outR * Math.sin(rad) };
      });
      return { cx, cy, pts, outs, outR };
    };

    const drawScene = (time, dt, animate) => {
      const L = layout();
      const px = (mouse.sx - 0.5) * 16;
      const py = (mouse.sy - 0.5) * 12;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(px, py);

      // ---- edges: input chain ----
      ctx.lineWidth = 1;
      for (let i = 0; i < L.pts.length - 1; i++) {
        const a = L.pts[i], b = L.pts[i + 1];
        const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        g.addColorStop(0, 'rgba(140,160,220,0.10)');
        g.addColorStop(1, 'rgba(123,160,255,0.5)');
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // ---- edges: outputs ----
      L.outs.forEach((o) => {
        const g = ctx.createLinearGradient(L.cx, L.cy, o.x, o.y);
        g.addColorStop(0, 'rgba(171,159,249,0.45)');
        g.addColorStop(1, 'rgba(140,160,220,0.10)');
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(L.cx, L.cy);
        ctx.lineTo(o.x, o.y);
        ctx.stroke();
      });

      // ---- particles along input chain ----
      if (animate) {
        particles.forEach((p) => {
          p.t += p.speed * dt;
          while (p.t > 1) { p.t -= 1; p.t += Math.random() * 0.15; }
        });
      } else {
        particles.forEach((p, idx) => { p.t = (idx % 5) / 5; });
      }
      const segPoint = (p) => {
        const a = L.pts[p.seg];
        const b = p.seg >= L.pts.length - 1 ? { x: L.cx, y: L.cy } : L.pts[p.seg + 1];
        return { x: a.x + (b.x - a.x) * p.t, y: a.y + (b.y - a.y) * p.t };
      };
      particles.forEach((p) => {
        const pos = segPoint(p);
        const fade = Math.sin(Math.min(p.t, 1 - p.t) * Math.PI); // fade near ends
        ctx.globalAlpha = 0.25 + 0.75 * Math.max(fade, 0.15);
        const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 6);
        grd.addColorStop(0, 'rgba(190,212,255,1)');
        grd.addColorStop(1, 'rgba(123,160,255,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dbe7ff';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // ---- output emission pulses ----
      if (animate) {
        emitTimer -= dt;
        if (emitTimer <= 0) {
          emitTimer = 2.4 + Math.random() * 1.4;
          rings.push({ r: 10, alpha: 0.5 });
        }
      }
      rings.forEach((r) => {
        r.r += (animate ? dt : 0) * 60;
        r.alpha *= animate ? 0.96 : 0.94;
        ctx.strokeStyle = `rgba(139,124,246,${Math.max(r.alpha, 0)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(L.cx, L.cy, r.r, 0, Math.PI * 2);
        ctx.stroke();
      });
      rings = rings.filter((r) => r.alpha > 0.03 && r.r < 130);
      ctx.lineWidth = 1;

      // ---- core (LLM) ----
      const pulse = animate ? 1 + Math.sin(time * 0.0016) * 0.04 : 1;
      const coreR = 30 * pulse;
      const halo = ctx.createRadialGradient(L.cx, L.cy, 0, L.cx, L.cy, 110);
      halo.addColorStop(0, 'rgba(124,140,255,0.32)');
      halo.addColorStop(0.55, 'rgba(124,140,255,0.09)');
      halo.addColorStop(1, 'rgba(124,140,255,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(L.cx, L.cy, 110, 0, Math.PI * 2);
      ctx.fill();

      // rotating arc
      const rot = animate ? time * 0.00045 : 0.8;
      ctx.strokeStyle = 'rgba(171,159,249,0.85)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(L.cx, L.cy, coreR + 11, rot, rot + Math.PI * 0.85);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(123,160,255,0.5)';
      ctx.beginPath();
      ctx.arc(L.cx, L.cy, coreR + 11, rot + Math.PI, rot + Math.PI * 1.6);
      ctx.stroke();

      const coreGrad = ctx.createLinearGradient(L.cx - coreR, L.cy - coreR, L.cx + coreR, L.cy + coreR);
      coreGrad.addColorStop(0, '#4d7df7');
      coreGrad.addColorStop(1, '#8b7cf6');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(L.cx, L.cy, coreR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.beginPath();
      ctx.arc(L.cx - coreR * 0.26, L.cy - coreR * 0.3, coreR * 0.18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(237,241,250,0.92)';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AI CORE', L.cx, L.cy + coreR + 26);

      // ---- input nodes ----
      L.pts.forEach((p, i) => {
        const isLast = i === L.pts.length - 1;
        const r = isLast ? 7 : 6;
        ctx.fillStyle = '#0b0e17';
        ctx.strokeStyle = isLast ? 'rgba(171,159,249,1)' : 'rgba(123,160,255,0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.fillStyle = isLast ? 'rgba(237,241,250,0.95)' : 'rgba(205,214,232,0.92)';
        ctx.font = '600 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(INPUTS[i], p.x, p.y + 21);
      });

      // ---- output nodes ----
      ctx.textAlign = 'left';
      L.outs.forEach((o, i) => {
        const flash = outputFlashes[i];
        if (animate) outputFlashes[i] = Math.max(0, flash - dt * 2);
        ctx.fillStyle = '#0b0e17';
        ctx.strokeStyle = `rgba(${139 + flash * 60},${124 + flash * 80},246,${0.5 + flash * 0.5})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(o.x, o.y, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.fillStyle = `rgba(151,161,184,${0.75 + flash * 0.25})`;
        ctx.font = '600 10px Inter, sans-serif';
        ctx.fillText(OUTPUTS[i], o.x + 12, o.y + 3);
      });

      ctx.restore();
    };

    const loop = (time) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const dt = 0.016;
      mouse.sx += (mouse.x - mouse.sx) * 0.05;
      mouse.sy += (mouse.y - mouse.sy) * 0.05;
      drawScene(time, dt, true);
    };

    resize();
    if (reducedMotion) {
      drawScene(0, 0, false);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reducedMotion) drawScene(0, 0, false);
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(wrap);

    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      mouse.x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      mouse.y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full aspect-[5/4] max-w-[560px]" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
