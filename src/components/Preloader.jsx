"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL = 151;
const pad   = (n, size) => String(n).padStart(size, "0");

// ── Three.js knot spinner ──────────────────────────────────────────────────
function initScene(container) {
  const THREE = window.THREE;
  if (!THREE || !container) return null;

  const BG       = 0x030303;
  const BGCSS    = "#030303";
  const SIZE     = 320;
  const length   = 30;
  const radius   = 5.6;
  const pi2      = Math.PI * 2;

  let rotatevalue = 0.035;
  let acceleration = 0, animatestep = 0, toend = false;

  const group  = new THREE.Group();
  const camera = new THREE.PerspectiveCamera(65, 1, 1, 10000);
  camera.position.z = 150;

  const scene = new THREE.Scene();
  scene.add(group);

  // Lemniscate / torus-knot tube
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(
      new (THREE.Curve.create(function () {}, function (percent) {
        const x = length * Math.sin(pi2 * percent);
        const y = radius * Math.cos(pi2 * 3 * percent);
        let t   = (percent % 0.25) / 0.25;
        t = (percent % 0.25) - (2 * (1 - t) * t * -0.0185 + t * t * 0.25);
        if (Math.floor(percent / 0.25) === 0 || Math.floor(percent / 0.25) === 2) t *= -1;
        const z = radius * Math.sin(pi2 * 2 * (percent - t));
        return new THREE.Vector3(x, y, z);
      }))(),
      200, 1.1, 2, true
    ),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  group.add(mesh);

  // Ring cover (matches bg so it hides the far end of the tube)
  const ringcover = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 15, 1),
    new THREE.MeshBasicMaterial({ color: BG, opacity: 0, transparent: true })
  );
  ringcover.position.x = length + 1;
  ringcover.rotation.y = Math.PI / 2;
  group.add(ringcover);

  // Closing ring (appears at the end of the press-hold interaction)
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(4.3, 5.55, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true })
  );
  ring.position.x = length + 1.1;
  ring.rotation.y = Math.PI / 2;
  group.add(ring);

  // Fake depth-shadow planes
  for (let i = 0; i < 10; i++) {
    const plain = new THREE.Mesh(
      new THREE.PlaneGeometry(length * 2 + 1, radius * 3, 1),
      new THREE.MeshBasicMaterial({ color: BG, transparent: true, opacity: 0.13 })
    );
    plain.position.z = -2.5 + i * 0.5;
    group.add(plain);
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(SIZE, SIZE);
  renderer.setClearColor(BGCSS);
  container.appendChild(renderer.domElement);
  // Let CSS stretch the canvas to fill whatever the container is
  renderer.domElement.style.width  = "100%";
  renderer.domElement.style.height = "100%";

  const easing = (t, b, c, d) => {
    if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  };

  const onStart = () => { toend = true; };
  const onEnd   = () => { toend = false; };
  document.addEventListener("mousedown",  onStart, false);
  document.addEventListener("touchstart", onStart, false);
  document.addEventListener("mouseup",    onEnd,   false);
  document.addEventListener("touchend",   onEnd,   false);

  let rafId;
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    mesh.rotation.x += rotatevalue + acceleration;
    animatestep  = Math.max(0, Math.min(240, toend ? animatestep + 1 : animatestep - 4));
    acceleration = easing(animatestep, 0, 1, 240);

    if (acceleration > 0.35) {
      const p  = (acceleration - 0.35) / 0.65;
      group.rotation.y  = (-Math.PI / 2) * p;
      group.position.z  = 50 * p;
      const p2 = Math.max(0, (acceleration - 0.97) / 0.03);
      mesh.material.opacity            = 1 - p2;
      ringcover.material.opacity       = p2;
      ring.material.opacity            = p2;
      ring.scale.x = ring.scale.y      = 0.9 + 0.1 * p2;
    }

    renderer.render(scene, camera);
  };
  animate();

  // Return cleanup fn
  return () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener("mousedown",  onStart, false);
    document.removeEventListener("touchstart", onStart, false);
    document.removeEventListener("mouseup",    onEnd,   false);
    document.removeEventListener("touchend",   onEnd,   false);
    renderer.dispose();
    if (container && container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
}

// ── Component ──────────────────────────────────────────────────────────────
export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(
    () => (typeof window !== "undefined" && window.fluidFrames?.length > 0 ? 100 : 0)
  );
  const [done, setDone] = useState(
    () => typeof window !== "undefined" && window._preloaderDone === true
  );
  const mountRef   = useRef(null);
  const cleanupRef = useRef(null);

  // ── Load THREE.js from CDN then boot scene ──────────────────────────────
  useEffect(() => {
    if (done) return;

    const boot = () => {
      if (cleanupRef.current) return;
      const cleanup = initScene(mountRef.current);
      if (cleanup) cleanupRef.current = cleanup;
    };

    if (window.THREE) {
      boot();
    } else {
      const script = document.createElement("script");
      script.src   = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r77/three.min.js";
      script.onload = boot;
      document.head.appendChild(script);
    }

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fluid frame loading (unchanged logic) ───────────────────────────────
  useEffect(() => {
    if (window._preloaderDone) {
      onComplete?.();
      return;
    }

    if (Array.isArray(window.fluidFrames) && window.fluidFrames.length > 0) {
      setProgress(100);
      window._preloaderDone = true;
      setDone(true);
      setTimeout(() => onComplete?.(), 700);
      return;
    }

    if (window._fluidLoading) {
      const poll = setInterval(() => {
        setProgress(Math.floor(((window._fluidLoaded ?? 0) / TOTAL) * 100));
        if (Array.isArray(window.fluidFrames) && window.fluidFrames.length > 0) {
          clearInterval(poll);
          setProgress(100);
          window._preloaderDone = true;
          setDone(true);
          setTimeout(() => onComplete?.(), 700);
        }
      }, 150);
      return () => clearInterval(poll);
    }

    window._fluidLoading = true;
    window._fluidLoaded  = 0;

    const promises = Array.from({ length: TOTAL }, (_, i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.src   = `/fluid-sequence/ezgif-frame-${pad(i + 1, 3)}.png`;
        const settle = () => {
          window._fluidLoaded = (window._fluidLoaded ?? 0) + 1;
          setProgress(Math.floor((window._fluidLoaded / TOTAL) * 100));
          resolve(img.complete && img.naturalWidth ? img : null);
        };
        img.onload  = settle;
        img.onerror = settle;
      })
    );

    Promise.all(promises).then((imgs) => {
      window.fluidFrames  = imgs.filter(Boolean);
      window._fluidLoading = false;
      setProgress(100);
      setTimeout(() => {
        window._preloaderDone = true;
        setDone(true);
        setTimeout(() => onComplete?.(), 700);
      }, 600);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030303] select-none"
        >
          {/* Three.js spinner — centred, fills the screen */}
          <div
            ref={mountRef}
            style={{ width: "80vmin", height: "80vmin", maxWidth: 620, maxHeight: 620 }}
          />

          {/* Slim progress bar pinned to bottom */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48">
            <div className="w-full h-px bg-neutral-900 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-neutral-800 via-white to-neutral-800 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
