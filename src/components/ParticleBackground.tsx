import React, { useEffect, useRef } from 'react';

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;

    let mouseX = -1000;
    let mouseY = -1000;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Mouse position within the canvas
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      emitTrailParticle();
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Background Particles
    interface BgParticle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      offset: number;
    }

    const bgParticles: BgParticle[] = [];
    const colors = ['rgba(139, 92, 246,', 'rgba(59, 130, 246,']; // Purple, Blue

    for (let i = 0; i < 600; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      bgParticles.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        offset: Math.random() * Math.PI * 2
      });
    }

    // Cursor Trail Particles
    interface TrailParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      shape: 'square' | 'triangle' | 'circle';
      color: string;
      rotation: number;
      rotationSpeed: number;
    }

    let trailParticles: TrailParticle[] = [];
    const shapes: ('square' | 'triangle' | 'circle')[] = ['square', 'triangle', 'circle'];

    const emitTrailParticle = () => {
      trailParticles.push({
        x: mouseX,
        y: mouseY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() * 2) + 1, // falling down
        life: 1,
        maxLife: Math.random() * 0.5 + 0.5,
        size: Math.random() * 6 + 3,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    };

    let time = 0;

    const render = () => {
      const isDark = document.documentElement.classList.contains('dark');
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Render BG Particles
      for (let p of bgParticles) {
        let dx = p.baseX - mouseX;
        let dy = p.baseY - mouseY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        // Breathing effect
        const breath = Math.sin(p.offset + time * 1.5);
        const alpha = (breath + 1) * 0.4 + 0.05; // 0.05 to 0.85

        let targetX = p.baseX + Math.sin(p.offset + time * 0.6) * 25;
        let targetY = p.baseY + Math.cos(p.offset + time * 0.6) * 25;

        // Concentrate near cursor
        if (dist < 250) {
           const force = (250 - dist) / 250;
           targetX -= dx * force * 0.6;
           targetY -= dy * force * 0.6;
        }

        // Smoothly move to target
        p.x += (targetX - p.x) * 0.05;
        p.y += (targetY - p.y) * 0.05;
        
        ctx.beginPath();
        const currentSize = p.size * (0.8 + 0.4 * breath); // Scale size with breath
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${alpha})`;
        ctx.shadowBlur = isDark ? (5 + 15 * alpha) : (1 + 4 * alpha);
        ctx.shadowColor = `${p.color} ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Render Trail Particles
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        let p = trailParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.rotation += p.rotationSpeed;

        if (p.life <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        ctx.fillStyle = `${p.color} ${p.life / p.maxLife})`;
        ctx.shadowBlur = isDark ? 15 : 4;
        ctx.shadowColor = `${p.color} ${p.life / p.maxLife})`;

        ctx.beginPath();
        if (p.shape === 'circle') {
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'square') {
          ctx.rect(-p.size/2, -p.size/2, p.size, p.size);
          ctx.fill();
        } else if (p.shape === 'triangle') {
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size, p.size);
          ctx.lineTo(-p.size, p.size);
          ctx.closePath();
          ctx.fill();
        }
        
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 mix-blend-normal dark:mix-blend-screen bg-transparent"
    />
  );
}
