"use client";

import { useEffect, useRef, useState } from "react";

const YELLOW = "#F8EF3B";

// Chart shape in normalised space (x 0→1 left→right, y 0→1 bottom→top):
// a climb, a small bump, a peak, a dip, then the long run to the top-right
const CONTROL = [
  [0.0, 0.1], [0.12, 0.33], [0.2, 0.26], [0.38, 0.62],
  [0.55, 0.36], [0.8, 0.72], [1.0, 0.97],
];
const SAMPLES = 220;

// Static fallback (no WebGL / reduced motion) — same silhouette as an SVG
const FALLBACK_LINE = "M0 216 C 30 190, 40 160, 48 161 S 70 180, 80 178 S 130 95, 152 91 S 200 152, 220 154 S 290 90, 320 67 S 385 15, 400 7";

function StaticChart() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="gc-static-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={YELLOW} stopOpacity="0.7" />
          <stop offset="100%" stopColor={YELLOW} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${FALLBACK_LINE} L400 240 L0 240 Z`} fill="url(#gc-static-fill)" />
      <path d={FALLBACK_LINE} fill="none" stroke={YELLOW} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function GrowthChart3D({ className = "" }) {
  const wrapRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    // Load three.js only when the chart is about to scroll into view
    const loader = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      loader.disconnect();

      const THREE = await import("three");
      const { Line2 } = await import("three/addons/lines/Line2.js");
      const { LineGeometry } = await import("three/addons/lines/LineGeometry.js");
      const { LineMaterial } = await import("three/addons/lines/LineMaterial.js");
      if (disposed) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        setFallback(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
      wrap.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -10, 10);
      const color = new THREE.Color(YELLOW);

      // Smooth curve through the control points, sampled evenly
      const curve = new THREE.CatmullRomCurve3(
        CONTROL.map(([x, y]) => new THREE.Vector3(x, y, 0)), false, "catmullrom", 0.25,
      );
      const norm = curve.getSpacedPoints(SAMPLES - 1);

      // ── Gradient fill: a strip from the curve down to the bottom edge ──
      const fillGeo = new THREE.BufferGeometry();
      const fillPos = new Float32Array(SAMPLES * 2 * 3);
      const fillT = new Float32Array(SAMPLES * 2);       // 1 at the line, 0 at the bottom
      const fillX = new Float32Array(SAMPLES * 2);       // normalised x, for reveal / shimmer
      const idx = [];
      for (let i = 0; i < SAMPLES; i++) {
        fillT[i * 2] = 1; fillT[i * 2 + 1] = 0;
        fillX[i * 2] = fillX[i * 2 + 1] = norm[i].x;
        if (i < SAMPLES - 1) {
          const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
          idx.push(a, b, c, b, d, c);
        }
      }
      fillGeo.setIndex(idx);
      fillGeo.setAttribute("position", new THREE.BufferAttribute(fillPos, 3));
      fillGeo.setAttribute("aT", new THREE.BufferAttribute(fillT, 1));
      fillGeo.setAttribute("aX", new THREE.BufferAttribute(fillX, 1));

      const fillMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: color },
          uReveal: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader: /* glsl */`
          attribute float aT;
          attribute float aX;
          varying float vT;
          varying float vX;
          void main() {
            vT = aT; vX = aX;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */`
          uniform vec3 uColor;
          uniform float uReveal;
          uniform float uTime;
          varying float vT;
          varying float vX;
          void main() {
            // Brightest at the line, fading to nothing at the bottom
            float a = 0.72 * pow(vT, 1.7);
            // Slow band of light sweeping left → right across the fill
            float sweep = fract(uTime * 0.09) * 1.6 - 0.3;
            a += 0.22 * exp(-pow((vX - sweep) * 7.0, 2.0)) * vT;
            // Only show what the line has already drawn, with a soft edge
            a *= 1.0 - smoothstep(uReveal - 0.04, uReveal, vX);
            gl_FragColor = vec4(uColor, a);
          }
        `,
      });
      const fill = new THREE.Mesh(fillGeo, fillMat);
      scene.add(fill);

      // ── The line itself (screen-space width, partially drawn) ──
      const lineGeo = new LineGeometry();
      const lineMat = new LineMaterial({ color: YELLOW, linewidth: 2.5, worldUnits: false, transparent: true });
      const line = new Line2(lineGeo, lineMat);
      scene.add(line);

      // ── Glowing tip that rides the drawing edge ──
      const glowMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: color }, uPulse: { value: 0 } },
        vertexShader: /* glsl */`
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */`
          uniform vec3 uColor;
          uniform float uPulse;
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float core = smoothstep(0.22, 0.12, d);
            float halo = exp(-d * d * 4.0) * (0.55 + 0.35 * uPulse);
            gl_FragColor = vec4(mix(uColor, vec3(1.0), core * 0.6), (core + halo) * smoothstep(1.0, 0.7, d));
          }
        `,
      });
      const tip = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMat);
      tip.position.z = 1;
      scene.add(tip);

      // Pixel-space layout — rebuilt on resize so line width and the dot stay true
      let W = 1, H = 1;
      let pts = [];
      const layout = () => {
        W = Math.max(1, wrap.clientWidth);
        H = Math.max(1, wrap.clientHeight);
        renderer.setSize(W, H, false);
        camera.right = W; camera.top = H; camera.updateProjectionMatrix();
        lineMat.resolution.set(W, H);

        const padTop = 6, padX = 0;
        pts = norm.map((p) => [padX + p.x * (W - padX * 2), p.y * (H - padTop)]);

        for (let i = 0; i < SAMPLES; i++) {
          const [x, y] = pts[i];
          fillPos.set([x, y, 0], i * 6);
          fillPos.set([x, 0, 0], i * 6 + 3);
        }
        fillGeo.attributes.position.needsUpdate = true;
        fillGeo.computeBoundingSphere();

        lineGeo.setPositions(pts.flatMap(([x, y]) => [x, y, 0]));
        const size = Math.max(22, Math.min(W, H) * 0.09);
        tip.scale.set(size, size, 1);
      };
      layout();
      const ro = new ResizeObserver(layout);
      ro.observe(wrap);

      // Scroll drives how much of the line is drawn — lerped so it always glides
      let reveal = reduce ? 1 : 0;
      let target = reveal;
      const readScroll = () => {
        const r = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        // Starts drawing as the chart's top enters the lower screen, done by the time it's near the top third
        const p = (vh * 0.95 - r.top) / (vh * 0.7);
        target = Math.max(target, Math.min(1, Math.max(0, p)));   // never un-draws
      };
      readScroll();

      let visible = true;
      const vis = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
      vis.observe(wrap);

      const clock = new THREE.Clock();
      let raf;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) return;

        const t = clock.getElapsedTime();
        readScroll();
        reveal += (target - reveal) * (reduce ? 1 : 0.08);
        if (Math.abs(target - reveal) < 0.0005) reveal = target;

        // Draw the line up to the reveal point
        const count = Math.max(1, Math.round(reveal * (SAMPLES - 1)));
        lineGeo.instanceCount = count;
        fillMat.uniforms.uReveal.value = reveal * 1.04;
        fillMat.uniforms.uTime.value = reduce ? 0 : t;

        // Tip sits on the drawing edge; once fully drawn it gently pulses at the end
        const [tx, ty] = pts[Math.min(count, SAMPLES - 1)];
        tip.position.set(tx, ty, 1);
        glowMat.uniforms.uPulse.value = reveal > 0.999 ? 0.5 + 0.5 * Math.sin(t * 2.4) : 1;
        tip.visible = reveal > 0.01;

        renderer.render(scene, camera);
      };
      frame();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        vis.disconnect();
        fillGeo.dispose(); fillMat.dispose();
        lineGeo.dispose(); lineMat.dispose();
        tip.geometry.dispose(); glowMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }, { rootMargin: "300px 0px" });

    loader.observe(wrap);
    return () => {
      disposed = true;
      loader.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`} aria-hidden="true">
      {fallback && <StaticChart />}
    </div>
  );
}
