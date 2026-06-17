"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvasBg() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false });
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let particles = [];
    let cubes = [];
    let droplets = [];
    let width = 0;
    let height = 0;
    let isVisible = true;

    // Brand Colors (RGBA format for alpha styling)
    const colors = [
      "rgba(255, 107, 61, ",  // brand-orange (#ff6b3d)
      "rgba(0, 85, 255, ",    // brand-blue (#0055ff)
      "rgba(255, 255, 255, ",  // white
    ];

    // ── 3D Cube Class ────────────────────────────────────────────────────────
    class Cube3D {
      constructor() {
        this.reset();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 180 + 100; // depth coordinate
        this.size = Math.random() * 25 + 15; // 15px to 40px
        
        // Very slow drifting speed
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;

        // Rotations and rotational velocities
        this.rx = Math.random() * Math.PI;
        this.ry = Math.random() * Math.PI;
        this.rz = Math.random() * Math.PI;
        this.vrx = (Math.random() - 0.5) * 0.012;
        this.vry = (Math.random() - 0.5) * 0.012;
        this.vrz = (Math.random() - 0.5) * 0.012;

        // Cube vertices in local space
        this.vertices = [
          [-1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [-1,  1, -1], // Back face
          [-1, -1,  1], [ 1, -1,  1], [ 1,  1,  1], [-1,  1,  1]  // Front face
        ];

        // Cube edges connecting vertices
        this.edges = [
          [0, 1], [1, 2], [2, 3], [3, 0], // Back loop
          [4, 5], [5, 6], [6, 7], [7, 4], // Front loop
          [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
        ];

        this.colorIndex = Math.random() > 0.55 ? 0 : 1; // orange or blue
        this.alpha = Math.random() * 0.12 + 0.07; // subtle opacity
      }

      update() {
        this.rx += this.vrx;
        this.ry += this.vry;
        this.rz += this.vrz;
        this.x += this.vx;
        this.y += this.vy;

        // Subtle repulsion from mouse
        if (mouseRef.current.active) {
          const dx = this.x - mouseRef.current.x;
          const dy = this.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const force = (200 - dist) / 200 * 0.4;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
          }
        }

        // Wrap around borders
        if (this.x < -this.size * 2) this.x = width + this.size * 2;
        if (this.x > width + this.size * 2) this.x = -this.size * 2;
        if (this.y < -this.size * 2) this.y = height + this.size * 2;
        if (this.y > height + this.size * 2) this.y = -this.size * 2;
      }

      draw() {
        const projected = [];
        const focalLength = 320; // 3D projection constant

        for (let i = 0; i < this.vertices.length; i++) {
          let [vx, vy, vz] = this.vertices[i];
          
          vx *= this.size;
          vy *= this.size;
          vz *= this.size;

          // Rotation around X
          let y1 = vy * Math.cos(this.rx) - vz * Math.sin(this.rx);
          let z1 = vy * Math.sin(this.rx) + vz * Math.cos(this.rx);
          
          // Rotation around Y
          let x2 = vx * Math.cos(this.ry) + z1 * Math.sin(this.ry);
          let z2 = -vx * Math.sin(this.ry) + z1 * Math.cos(this.ry);
          
          // Rotation around Z
          let x3 = x2 * Math.cos(this.rz) - y1 * Math.sin(this.rz);
          let y3 = x2 * Math.sin(this.rz) + y1 * Math.cos(this.rz);

          // Perspective scaling
          const scale = focalLength / (focalLength + z2);
          const screenX = this.x + x3 * scale;
          const screenY = this.y + y3 * scale;

          projected.push([screenX, screenY]);
        }

        // Draw wireframe edges
        ctx.beginPath();
        ctx.strokeStyle = colors[this.colorIndex] + this.alpha + ")";
        ctx.lineWidth = 0.9;
        for (let i = 0; i < this.edges.length; i++) {
          const [startIdx, endIdx] = this.edges[i];
          const start = projected[startIdx];
          const end = projected[endIdx];
          ctx.moveTo(start[0], start[1]);
          ctx.lineTo(end[0], end[1]);
        }
        ctx.stroke();

        // Draw small vertex dots
        projected.forEach(([sx, sy]) => {
          ctx.beginPath();
          ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = colors[this.colorIndex] + (this.alpha * 1.6) + ")";
          ctx.fill();
        });
      }
    }

    // ── Liquid Droplet Class ──────────────────────────────────────────────────
    class Droplet {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -30;
        this.vy = Math.random() * 1.6 + 0.9; // falling velocity
        this.vx = (Math.random() - 0.5) * 0.15;
        this.length = Math.random() * 15 + 10; // droplet tail length
        this.width = Math.random() * 1.8 + 1.0;  // width of drop
        this.alpha = Math.random() * 0.22 + 0.12;
        // Mostly blue water accent colors
        this.colorIndex = Math.random() > 0.35 ? 1 : 0; 
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;

        // Displace droplets outward when close to mouse
        if (mouseRef.current.active) {
          const dx = this.x - mouseRef.current.x;
          const dy = this.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const force = (130 - dist) / 130 * 2.2;
            this.x += (dx / dist) * force;
          }
        }

        // Reset if it flows off-screen
        if (this.y > height + 30) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        // Create falling tail fading gradient
        const grad = ctx.createLinearGradient(this.x, this.y - this.length, this.x, this.y);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(0.7, colors[this.colorIndex] + (this.alpha * 0.7) + ")");
        grad.addColorStop(1, colors[this.colorIndex] + this.alpha + ")");

        ctx.strokeStyle = grad;
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.moveTo(this.x - this.vx * 2, this.y - this.length);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
      }
    }

    // ── Constellation Particle Class ──────────────────────────────────────────
    class Particle {
      constructor() {
        this.reset();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.65;
        this.vy = (Math.random() - 0.5) * 0.65;
        this.baseVx = this.vx;
        this.baseVy = this.vy;
        this.radius = Math.random() * 2 + 1;
        
        const rand = Math.random();
        if (rand < 0.45) {
          this.colorIndex = 0; // orange
        } else if (rand < 0.90) {
          this.colorIndex = 1; // blue
        } else {
          this.colorIndex = 2; // white
        }
        
        this.alpha = Math.random() * 0.4 + 0.3;
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }

      update(time) {
        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha > 0.85 || this.alpha < 0.2) {
          this.pulseDir *= -1;
        }

        const waveX = Math.sin(time * 0.0008 + this.y * 0.004) * 0.12;
        const waveY = Math.cos(time * 0.0008 + this.x * 0.004) * 0.12;

        let mouseForceX = 0;
        let mouseForceY = 0;
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          
          if (dist < 220) {
            const force = (220 - dist) / 220;
            mouseForceX = (dx / dist) * force * 0.5;
            mouseForceY = (dy / dist) * force * 0.5;
          }
        }

        let rippleForceX = 0;
        let rippleForceY = 0;
        for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const ripple = ripplesRef.current[i];
          const dx = this.x - ripple.x;
          const dy = this.y - ripple.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          const distFromWave = Math.abs(dist - ripple.currentRadius);
          if (distFromWave < 45 && dist > 10) {
            const force = (1 - distFromWave / 45) * ripple.force;
            rippleForceX += (dx / dist) * force * 5.0;
            rippleForceY += (dy / dist) * force * 5.0;
          }
        }

        this.vx = this.baseVx + waveX + mouseForceX + rippleForceX;
        this.vy = this.baseVy + waveY + mouseForceY + rippleForceY;

        this.vx *= 0.94;
        this.vy *= 0.94;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors[this.colorIndex] + this.alpha + ")";
        ctx.fill();

        if (this.radius > 2.2) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = colors[this.colorIndex] + (this.alpha * 0.12) + ")";
          ctx.fill();
        }
      }
    }

    const init = () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;

      const area = width * height;

      // 1. Initialize Particles (constellation)
      const baseDensity = width < 768 ? 13000 : 9000;
      const count = Math.min(Math.floor(area / baseDensity), 130);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }

      // 2. Initialize 3D Cubes (sparse: 4 on mobile, 7 on desktop)
      const cubeCount = width < 768 ? 4 : 7;
      cubes = [];
      for (let i = 0; i < cubeCount; i++) {
        cubes.push(new Cube3D());
      }

      // 3. Initialize Droplets (15 on mobile, 25 on desktop)
      const dropletCount = width < 768 ? 15 : 25;
      droplets = [];
      for (let i = 0; i < dropletCount; i++) {
        droplets.push(new Droplet());
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      init();
    });
    resizeObserver.observe(container);

    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    visibilityObserver.observe(container);

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripplesRef.current.push({
        x,
        y,
        currentRadius: 0,
        maxRadius: width < 768 ? 240 : 380,
        speed: width < 768 ? 6 : 9,
        force: 1.6,
        alpha: 0.85
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);

    const animate = (timestamp) => {
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return;

      if (mouseRef.current.active) {
        if (mouseRef.current.x === -1000) {
          mouseRef.current.x = mouseRef.current.targetX;
          mouseRef.current.y = mouseRef.current.targetY;
        } else {
          mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.07;
          mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.07;
        }
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw grid (deformable)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 0.5;

      const gridSpacing = width < 768 ? 50 : 80;
      const segmentLength = 25;
      const forceRadius = 180;
      const warpForce = 12;

      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        for (let y = 0; y <= height + segmentLength; y += segmentLength) {
          let px = x;
          let py = y;

          if (mouseRef.current.active) {
            const dx = px - mouseRef.current.x;
            const dy = py - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < forceRadius) {
              const force = (1 - dist / forceRadius) * warpForce;
              px += (dx / dist) * force;
              py += (dy / dist) * force;
            }
          }

          if (y === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        for (let x = 0; x <= width + segmentLength; x += segmentLength) {
          let px = x;
          let py = y;

          if (mouseRef.current.active) {
            const dx = px - mouseRef.current.x;
            const dy = py - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < forceRadius) {
              const force = (1 - dist / forceRadius) * warpForce;
              px += (dx / dist) * force;
              py += (dy / dist) * force;
            }
          }

          if (x === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // 2. Draw radial lighting
      if (mouseRef.current.active) {
        const glowRad = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 5,
          mouseRef.current.x, mouseRef.current.y, 200
        );
        glowRad.addColorStop(0, "rgba(255, 107, 61, 0.06)");
        glowRad.addColorStop(0.4, "rgba(0, 85, 255, 0.03)");
        glowRad.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = glowRad;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 200, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Process ripples
      ripplesRef.current.forEach((ripple, index) => {
        ripple.currentRadius += ripple.speed;
        ripple.alpha = 1 - (ripple.currentRadius / ripple.maxRadius);
        ripple.force = 1 - (ripple.currentRadius / ripple.maxRadius);

        if (ripple.alpha <= 0) {
          ripplesRef.current.splice(index, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 107, 61, ${ripple.alpha * 0.15})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, Math.max(0, ripple.currentRadius - 25), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 85, 255, ${ripple.alpha * 0.08})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 4. Update & Draw cubes
      cubes.forEach((cube) => {
        cube.update();
        cube.draw();
      });

      // 5. Update & Draw droplets
      droplets.forEach((drop) => {
        drop.update();
        drop.draw();
      });

      // 6. Update & Draw particles
      particles.forEach((p) => {
        p.update(timestamp);
        p.draw();
      });

      // 7. Draw connection lines
      ctx.lineWidth = 0.5;
      const connectDistLimit = width < 768 ? 80 : 115;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p1.x;
          const dy = mouseRef.current.y - p1.y;
          const distSq = dx * dx + dy * dy;
          const mouseConnectDist = width < 768 ? 130 : 180;
          
          if (distSq < mouseConnectDist * mouseConnectDist) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / mouseConnectDist) * 0.15;
            
            const grad = ctx.createLinearGradient(p1.x, p1.y, mouseRef.current.x, mouseRef.current.y);
            grad.addColorStop(0, colors[p1.colorIndex] + alpha + ")");
            grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.3})`);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = grad;
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectDistLimit * connectDistLimit) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / connectDistLimit) * 0.11;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, colors[p1.colorIndex] + alpha + ")");
            grad.addColorStop(1, colors[p2.colorIndex] + alpha + ")");
            
            ctx.strokeStyle = grad;
            ctx.stroke();
          }
        }
      }
    };

    init();
    animate(0);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden z-0 cursor-crosshair pointer-events-auto"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full opacity-70"
      />
    </div>
  );
}
