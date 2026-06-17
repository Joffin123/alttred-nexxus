"use client";

import { useEffect, useRef } from "react";

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Minimal dark-gel background
//   · 3 near-monochrome Gaussian orbs — very slow, very soft
//   · Static gloss highlight — gel/glass specular feel
//   · No bands, no grain — clean premium look
//   · u_scroll — subtle parallax drift
// ─────────────────────────────────────────────────────────────────────────────
const FRAG = `
precision mediump float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_scroll;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  uv.y += u_scroll * 0.12;

  vec2 m = (u_mouse - 0.5) * 0.05;
  float t = u_time * 0.13;

  // ── Deep dark base ────────────────────────────────────────────────────────
  vec3 col = vec3(0.013, 0.010, 0.010);

  // ── Orb 1 — large, glacially slow, barely-warm tint ──────────────────────
  vec2 p1 = vec2(sin(t * 0.22) * 0.38 - 0.08 + m.x,
                 cos(t * 0.16) * 0.28 + 0.07 + m.y);
  float b1 = exp(-dot(uv - p1, uv - p1) * 5.0);
  col += vec3(0.16, 0.09, 0.04) * b1 * 0.65;

  // ── Orb 2 — medium, upper-right, near-neutral cool ───────────────────────
  vec2 p2 = vec2(cos(t * 0.18) * 0.40 + 0.22,
                 sin(t * 0.13) * 0.30 - 0.10);
  float b2 = exp(-dot(uv - p2, uv - p2) * 7.5);
  col += vec3(0.07, 0.07, 0.09) * b2 * 0.9;

  // ── Orb 3 — small warm accent, lazily drifts top-left ────────────────────
  vec2 p3 = vec2(sin(t * 0.29 + 1.3) * 0.24 - 0.22,
                 cos(t * 0.23 + 0.8) * 0.18 + 0.20);
  float b3 = exp(-dot(uv - p3, uv - p3) * 15.0);
  col += vec3(0.18, 0.10, 0.05) * b3 * 0.38;

  // ── Gloss highlight — static specular, gel/glass feel ────────────────────
  vec2 gp = vec2(0.04, -0.08);
  float gloss = exp(-dot(uv - gp, uv - gp) * 20.0);
  col += vec3(0.09, 0.08, 0.07) * gloss * 0.55;

  // ── Soft vignette ─────────────────────────────────────────────────────────
  col *= clamp(1.0 - dot(uv * 0.80, uv * 0.80), 0.05, 1.0);

  // ── Bottom gradient — text readability ────────────────────────────────────
  float bFade = clamp((-uv.y - 0.22) * 2.5, 0.0, 1.0);
  col = mix(col, vec3(0.010, 0.008, 0.008), bFade * 0.88);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function FluidBackground() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef([0.5, 0.5]);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes    = gl.getUniformLocation(prog, "u_res");
    const uTime   = gl.getUniformLocation(prog, "u_time");
    const uMouse  = gl.getUniformLocation(prog, "u_mouse");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");

    // Cap DPR at 1 — the effect doesn't benefit from retina resolution
    const dpr = Math.min(window.devicePixelRatio ?? 1, 1.0);

    const resize = () => {
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking — ref only, no re-renders
    const onMove = (e) => {
      mouseRef.current = [
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight,
      ];
    };
    window.addEventListener("mousemove", onMove);

    // Scroll tracking — passive, normalized 0→1
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pause render loop when tab is hidden — saves battery / GPU
    let paused = false;
    const onVisibility = () => { paused = document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    const start = performance.now();
    let rafId;
    const render = () => {
      rafId = requestAnimationFrame(render);
      if (paused) return;
      gl.uniform1f(uTime,   (performance.now() - start) / 1000);
      gl.uniform2f(uMouse,  mouseRef.current[0], mouseRef.current[1]);
      gl.uniform1f(uScroll, scrollRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize",          resize);
      window.removeEventListener("mousemove",       onMove);
      window.removeEventListener("scroll",          onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#030303] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
