// src/components/BackgroundParticles.jsx
import { useEffect, useRef } from "react";

export default function Wallpaper({
  numParticles = 120,
  distance = 140,
  speed = 0.5,
  radius = 2,
  lineWidth = 0.6,
  particleColor = "#ffffff",
  lineColor = "#39c0ff",
  backgroundColor = "#292929",
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);

  // helpers
  const hexToRGB = (hex) => {
    const h = hex.startsWith("#") ? hex.slice(1) : hex;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return [r, g, b];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    // hi-DPI aware sizing
    const fitToScreen = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    canvas.style.backgroundColor = backgroundColor;
    fitToScreen();
    window.addEventListener("resize", fitToScreen);

    // particle model
    class Particle {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.vx = speed * 2 * Math.random() - speed;
        this.vy = speed * 2 * Math.random() - speed;
        this.color = particleColor;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < radius || this.x > window.innerWidth - radius) this.vx *= -1;
        if (this.y < radius || this.y > window.innerHeight - radius) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

    // init particles
    particlesRef.current = Array.from({ length: numParticles }, () => new Particle());
    const [lr, lg, lb] = hexToRGB(lineColor);

    // animation loop
    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i];

        // only check j > i to avoid duplicate lines
        for (let j = i + 1; j < ps.length; j++) {
          const b = ps[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d <= distance) {
            const opacity = 1 - d / distance;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${opacity})`;
            ctx.stroke();
            ctx.closePath();
          }
        }

        a.update();
        a.draw();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", fitToScreen);
    };
  }, [numParticles, distance, speed, radius, lineWidth, particleColor, lineColor, backgroundColor]);

  return <canvas ref={canvasRef} className="particles-canvas" aria-hidden="true" />;
}
