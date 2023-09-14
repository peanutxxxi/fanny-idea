import React, { useRef, useEffect } from 'react';

type StarType = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
}

const CenterStar: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const stars: StarType[] = [];

    const generateStar = () => {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;

      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      const speedX = (centerX - x) * 0.005;
      const speedY = (centerY - y) * 0.005;

      const size = Math.random() * 2;
      stars.push({ x, y, size, opacity: Math.random(), speedX, speedY });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (Math.abs(star.x - canvasWidth / 2) < 5 && Math.abs(star.y - canvasHeight / 2) < 5) {
          stars.splice(i, 1);
          i--;
          continue;
        }

        star.x += star.speedX;
        star.y += star.speedY;

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    setInterval(() => {
      generateStar();
    }, 1);

    animate();
  }, []);

  return <canvas className='bg-black' ref={canvasRef} width="800" height="600" style={{ position: 'absolute', top: 0, left: 0 }} />;
};

export default CenterStar;
