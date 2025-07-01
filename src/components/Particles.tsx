
import React from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface ParticlesProps {
  particles: Particle[];
}

export const Particles: React.FC<ParticlesProps> = ({ particles }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `translate(-50%, -50%)`,
            animation: `fade-out 1s ease-out forwards`
          }}
        />
      ))}
    </div>
  );
};
