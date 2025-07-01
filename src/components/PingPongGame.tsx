import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Particles } from './Particles';
import { PowerUp } from './PowerUp';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  trail: { x: number; y: number; opacity: number }[];
}

interface Paddle {
  y: number;
  height: number;
  speed: number;
  power: number;
}

interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  playerScore: number;
  aiScore: number;
  gameWon: boolean;
  winner: string;
  combo: number;
  powerUps: Array<{ x: number; y: number; type: string; id: number }>;
  totalHits: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 8;
const WINNING_SCORE = 7;
const INITIAL_BALL_SPEED = 3;
const MAX_BALL_SPEED = 8;

const PingPongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    playerScore: 0,
    aiScore: 0,
    gameWon: false,
    winner: '',
    combo: 0,
    powerUps: [],
    totalHits: 0
  });

  const [ball, setBall] = useState<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    vx: INITIAL_BALL_SPEED,
    vy: 2,
    speed: INITIAL_BALL_SPEED,
    trail: []
  });

  const [playerPaddle, setPlayerPaddle] = useState<Paddle>({
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    height: PADDLE_HEIGHT,
    speed: 6,
    power: 1
  });

  const [aiPaddle, setAiPaddle] = useState<Paddle>({
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    height: PADDLE_HEIGHT,
    speed: 4,
    power: 1
  });

  const [particles, setParticles] = useState<Array<any>>([]);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const createParticles = useCallback((x: number, y: number, color: string, count = 10) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1,
      color,
      size: Math.random() * 4 + 2
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const spawnPowerUp = useCallback(() => {
    if (Math.random() < 0.3) {
      const types = ['speed', 'size', 'multiball'];
      setGameState(prev => ({
        ...prev,
        powerUps: [...prev.powerUps, {
          x: Math.random() * (CANVAS_WIDTH - 40) + 20,
          y: Math.random() * (CANVAS_HEIGHT - 40) + 20,
          type: types[Math.floor(Math.random() * types.length)],
          id: Math.random()
        }]
      }));
    }
  }, []);

  const resetGame = useCallback(() => {
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      vx: Math.random() > 0.5 ? INITIAL_BALL_SPEED : -INITIAL_BALL_SPEED,
      vy: (Math.random() - 0.5) * 3,
      speed: INITIAL_BALL_SPEED,
      trail: []
    });
    
    setPlayerPaddle(prev => ({ ...prev, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 }));
    setAiPaddle(prev => ({ ...prev, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 }));
    
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      playerScore: 0,
      aiScore: 0,
      gameWon: false,
      winner: '',
      combo: 0,
      powerUps: [],
      totalHits: 0
    }));
    
    setParticles([]);
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameWon) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(1, '#1a1a3a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.setLineDash([5, 15]);
    ctx.strokeStyle = '#ffffff33';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    if (keys['w'] || keys['arrowup']) {
      setPlayerPaddle(prev => ({
        ...prev,
        y: Math.max(0, prev.y - prev.speed)
      }));
    }
    if (keys['s'] || keys['arrowdown']) {
      setPlayerPaddle(prev => ({
        ...prev,
        y: Math.min(CANVAS_HEIGHT - prev.height, prev.y + prev.speed)
      }));
    }

    setAiPaddle(prev => {
      const paddleCenter = prev.y + prev.height / 2;
      const ballCenter = ball.y;
      const diff = ballCenter - paddleCenter;
      const moveSpeed = Math.min(prev.speed, Math.abs(diff));
      
      return {
        ...prev,
        y: Math.max(0, Math.min(CANVAS_HEIGHT - prev.height, 
          prev.y + (diff > 0 ? moveSpeed : -moveSpeed) * 0.8))
      };
    });

    setBall(prev => {
      let newX = prev.x + prev.vx;
      let newY = prev.y + prev.vy;
      let newVx = prev.vx;
      let newVy = prev.vy;

      const newTrail = [
        { x: prev.x, y: prev.y, opacity: 1 },
        ...prev.trail.slice(0, 8)
      ].map((point, index) => ({
        ...point,
        opacity: (8 - index) / 8
      }));

      if (newY <= BALL_SIZE || newY >= CANVAS_HEIGHT - BALL_SIZE) {
        newVy = -newVy;
        createParticles(newX, newY, '#4ade80', 5);
      }

      if (newX <= PADDLE_WIDTH + BALL_SIZE && 
          newY >= playerPaddle.y - BALL_SIZE && 
          newY <= playerPaddle.y + playerPaddle.height + BALL_SIZE) {
        const speedMultiplier = Math.min(1 + (gameState.totalHits * 0.1), MAX_BALL_SPEED / INITIAL_BALL_SPEED);
        const baseSpeed = INITIAL_BALL_SPEED * speedMultiplier;
        
        newVx = Math.abs(baseSpeed);
        const relativeIntersectY = (newY - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);
        newVy = relativeIntersectY * (baseSpeed * 0.8);
        createParticles(newX, newY, '#3b82f6', 8);
        
        setGameState(prev => ({ 
          ...prev, 
          combo: prev.combo + 1,
          totalHits: prev.totalHits + 1
        }));
        spawnPowerUp();
      }

      if (newX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE && 
          newY >= aiPaddle.y - BALL_SIZE && 
          newY <= aiPaddle.y + aiPaddle.height + BALL_SIZE) {
        const speedMultiplier = Math.min(1 + (gameState.totalHits * 0.1), MAX_BALL_SPEED / INITIAL_BALL_SPEED);
        const baseSpeed = INITIAL_BALL_SPEED * speedMultiplier;
        
        newVx = -Math.abs(baseSpeed);
        const relativeIntersectY = (newY - (aiPaddle.y + aiPaddle.height / 2)) / (aiPaddle.height / 2);
        newVy = relativeIntersectY * (baseSpeed * 0.8);
        createParticles(newX, newY, '#ef4444', 8);
        
        setGameState(prev => ({ 
          ...prev,
          totalHits: prev.totalHits + 1
        }));
      }

      if (newX < 0) {
        setGameState(prev => {
          const newAiScore = prev.aiScore + 1;
          return {
            ...prev,
            aiScore: newAiScore,
            combo: 0,
            gameWon: newAiScore >= WINNING_SCORE,
            winner: newAiScore >= WINNING_SCORE ? 'AI' : ''
          };
        });
        createParticles(50, CANVAS_HEIGHT / 2, '#ef4444', 15);
        return {
          x: CANVAS_WIDTH / 2,
          y: CANVAS_HEIGHT / 2,
          vx: INITIAL_BALL_SPEED,
          vy: (Math.random() - 0.5) * 3,
          speed: INITIAL_BALL_SPEED,
          trail: []
        };
      }

      if (newX > CANVAS_WIDTH) {
        setGameState(prev => {
          const newPlayerScore = prev.playerScore + 1;
          return {
            ...prev,
            playerScore: newPlayerScore,
            gameWon: newPlayerScore >= WINNING_SCORE,
            winner: newPlayerScore >= WINNING_SCORE ? 'Player' : ''
          };
        });
        createParticles(CANVAS_WIDTH - 50, CANVAS_HEIGHT / 2, '#3b82f6', 15);
        return {
          x: CANVAS_WIDTH / 2,
          y: CANVAS_HEIGHT / 2,
          vx: -INITIAL_BALL_SPEED,
          vy: (Math.random() - 0.5) * 3,
          speed: INITIAL_BALL_SPEED,
          trail: []
        };
      }

      return {
        ...prev,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        trail: newTrail
      };
    });

    ball.trail.forEach((point, index) => {
      ctx.globalAlpha = point.opacity * 0.5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(point.x, point.y, BALL_SIZE * (point.opacity * 0.8), 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.globalAlpha = 1;

    ctx.shadowBlur = 20;
    ctx.shadowColor = '#3b82f6';
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(0, playerPaddle.y, PADDLE_WIDTH, playerPaddle.height);
    
    ctx.shadowColor = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, aiPaddle.y, PADDLE_WIDTH, aiPaddle.height);
    
    ctx.shadowBlur = 0;

    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_SIZE, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    setParticles(prev => prev
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 0.02,
        vx: particle.vx * 0.98,
        vy: particle.vy * 0.98
      }))
      .filter(particle => particle.life > 0)
    );

    particles.forEach(particle => {
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.globalAlpha = 1;

    gameState.powerUps.forEach(powerUp => {
      ctx.fillStyle = powerUp.type === 'speed' ? '#f59e0b' : 
                     powerUp.type === 'size' ? '#8b5cf6' : '#10b981';
      ctx.fillRect(powerUp.x, powerUp.y, 20, 20);
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, ball, playerPaddle, aiPaddle, keys, particles, createParticles, spawnPowerUp]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.gameWon) {
      gameLoop();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, gameState.isPlaying, gameState.isPaused, gameState.gameWon]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const currentSpeedMultiplier = Math.min(1 + (gameState.totalHits * 0.1), MAX_BALL_SPEED / INITIAL_BALL_SPEED);
  const currentSpeed = Math.round(INITIAL_BALL_SPEED * currentSpeedMultiplier * 10) / 10;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          🏓 Epic Ping Pong
        </h1>
        <p className="text-gray-300">Use W/S or Arrow Keys to control your paddle</p>
      </div>

      <div className="flex gap-4 mb-4">
        <Card className="bg-black/20 backdrop-blur-sm border-blue-500/30 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{gameState.playerScore}</div>
            <div className="text-sm text-gray-300">Player</div>
          </div>
        </Card>
        
        <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30 p-4">
          <div className="text-center">
            <div className="text-lg text-yellow-400">Combo: {gameState.combo}</div>
            {gameState.combo > 3 && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                🔥 ON FIRE!
              </Badge>
            )}
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-green-500/30 p-4">
          <div className="text-center">
            <div className="text-lg text-green-400">Speed: {currentSpeed}</div>
            <div className="text-sm text-gray-300">Hits: {gameState.totalHits}</div>
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-red-500/30 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{gameState.aiScore}</div>
            <div className="text-sm text-gray-300">AI</div>
          </div>
        </Card>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-gray-600 rounded-lg shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900"
        />
        
        {gameState.gameWon && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                🎉 {gameState.winner} Wins! 🎉
              </h2>
              <Button
                onClick={resetGame}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Play Again
              </Button>
            </div>
          </div>
        )}

        {!gameState.isPlaying && !gameState.gameWon && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-lg px-8 py-4"
            >
              <Play className="mr-2 h-6 w-6" />
              Start Game
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <Button
          onClick={pauseGame}
          disabled={!gameState.isPlaying || gameState.gameWon}
          className="bg-gray-700 hover:bg-gray-600"
        >
          <Pause className="mr-2 h-4 w-4" />
          {gameState.isPaused ? 'Resume' : 'Pause'}
        </Button>
        
        <Button
          onClick={resetGame}
          className="bg-red-600 hover:bg-red-700"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="mt-4 text-center text-gray-400 text-sm">
        <p>First to {WINNING_SCORE} points wins! • Ball speed increases with hits!</p>
      </div>
    </div>
  );
};

export default PingPongGame;
