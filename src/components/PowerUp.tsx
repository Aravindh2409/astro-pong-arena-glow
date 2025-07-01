
import React from 'react';
import { Zap, Maximize, Copy } from 'lucide-react';

interface PowerUpProps {
  type: 'speed' | 'size' | 'multiball';
  x: number;
  y: number;
}

export const PowerUp: React.FC<PowerUpProps> = ({ type, x, y }) => {
  const getIcon = () => {
    switch (type) {
      case 'speed':
        return <Zap className="h-4 w-4" />;
      case 'size':
        return <Maximize className="h-4 w-4" />;
      case 'multiball':
        return <Copy className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'speed':
        return 'bg-yellow-500';
      case 'size':
        return 'bg-purple-500';
      case 'multiball':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`absolute w-6 h-6 ${getColor()} rounded-md flex items-center justify-center text-white shadow-lg animate-pulse`}
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {getIcon()}
    </div>
  );
};
