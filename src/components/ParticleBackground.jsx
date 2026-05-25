import React, { useRef, useEffect } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '#c9a84c' : '#4a9b8e'
    }));
    
    let animId;
    let frameCount = 0;
    
    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance (30fps instead of 60fps)
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          p.y -= p.speedY;
          if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        });
        ctx.globalAlpha = 1;
      }
      animId = requestAnimationFrame(animate);
    };
    
    animate();
    
    const onResize = () => { 
      canvas.width = window.innerWidth; 
      canvas.height = window.innerHeight; 
    };
    
    window.addEventListener('resize', onResize);
    
    return () => { 
      cancelAnimationFrame(animId); 
      window.removeEventListener('resize', onResize); 
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} 
      aria-hidden="true"
    />
  );
};

export default ParticleBackground;