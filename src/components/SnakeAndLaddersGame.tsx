
import React, { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameState {
  currentPlayer: number;
  playerPositions: number[];
  isRolling: boolean;
  diceValue: number;
  winner: number | null;
  gameStarted: boolean;
}

const SnakeAndLaddersGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: 0,
    playerPositions: [0, 0],
    isRolling: false,
    diceValue: 1,
    winner: null,
    gameStarted: false
  });

  // Snake and Ladder positions
  const snakes = {
    16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78
  };
  
  const ladders = {
    1: 38, 4: 14, 9: 21, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
  };

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = icons[value - 1];
    return <Icon className="w-8 h-8" />;
  };

  const rollDice = () => {
    if (gameState.isRolling || gameState.winner) return;
    
    setGameState(prev => ({ ...prev, isRolling: true, gameStarted: true }));
    
    // Animate dice rolling
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setGameState(prev => ({ ...prev, diceValue: Math.floor(Math.random() * 6) + 1 }));
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalDiceValue = Math.floor(Math.random() * 6) + 1;
        
        setTimeout(() => {
          movePlayer(finalDiceValue);
        }, 500);
      }
    }, 100);
  };

  const movePlayer = (diceValue: number) => {
    const currentPos = gameState.playerPositions[gameState.currentPlayer];
    let newPos = currentPos + diceValue;
    
    // Don't go beyond 100
    if (newPos > 100) {
      newPos = currentPos;
    }
    
    // Check for snakes and ladders
    if (snakes[newPos as keyof typeof snakes]) {
      newPos = snakes[newPos as keyof typeof snakes];
    } else if (ladders[newPos as keyof typeof ladders]) {
      newPos = ladders[newPos as keyof typeof ladders];
    }
    
    const newPositions = [...gameState.playerPositions];
    newPositions[gameState.currentPlayer] = newPos;
    
    // Check for winner
    const winner = newPos === 100 ? gameState.currentPlayer + 1 : null;
    
    setGameState(prev => ({
      ...prev,
      playerPositions: newPositions,
      currentPlayer: winner ? prev.currentPlayer : (prev.currentPlayer + 1) % 2,
      isRolling: false,
      diceValue: diceValue,
      winner
    }));
  };

  const resetGame = () => {
    setGameState({
      currentPlayer: 0,
      playerPositions: [0, 0],
      isRolling: false,
      diceValue: 1,
      winner: null,
      gameStarted: false
    });
  };

  const getSquarePosition = (position: number) => {
    if (position === 0) return { row: 10, col: 0 };
    
    const row = Math.floor((position - 1) / 10);
    const col = (position - 1) % 10;
    
    // Snake pattern - reverse every other row
    const actualRow = 9 - row;
    const actualCol = row % 2 === 0 ? col : 9 - col;
    
    return { row: actualRow, col: actualCol };
  };

  const renderBoard = () => {
    const squares = [];
    
    for (let i = 100; i >= 1; i--) {
      const { row, col } = getSquarePosition(i);
      const hasSnake = snakes[i as keyof typeof snakes];
      const hasLadder = ladders[i as keyof typeof ladders];
      const player1Here = gameState.playerPositions[0] === i;
      const player2Here = gameState.playerPositions[1] === i;
      
      squares.push(
        <div
          key={i}
          className={`
            relative border border-gray-300 flex items-center justify-center text-sm font-bold
            ${hasSnake ? 'bg-red-200' : hasLadder ? 'bg-green-200' : 'bg-white'}
            ${i % 2 === 0 ? 'bg-opacity-50' : ''}
            transition-all duration-300 hover:bg-opacity-80
          `}
          style={{
            gridRow: row + 1,
            gridColumn: col + 1,
            aspectRatio: '1'
          }}
        >
          <span className="absolute top-1 left-1 text-xs text-gray-600">{i}</span>
          
          {hasSnake && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse">🐍</div>
            </div>
          )}
          
          {hasLadder && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-green-500 rounded-full animate-bounce">🪜</div>
            </div>
          )}
          
          {player1Here && (
            <div className="absolute bottom-1 left-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse">
              <span className="text-xs text-white font-bold">1</span>
            </div>
          )}
          
          {player2Here && (
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse">
              <span className="text-xs text-white font-bold">2</span>
            </div>
          )}
        </div>
      );
    }
    
    return squares;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🐍 Snake & Ladders 🪜</h1>
          <p className="text-gray-600">Roll the dice and climb to victory!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div 
                className="grid grid-cols-10 gap-1 w-full max-w-2xl mx-auto"
                style={{ aspectRatio: '1' }}
              >
                {renderBoard()}
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div className="space-y-6">
            {/* Player Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Players</h2>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border-2 ${gameState.currentPlayer === 0 && !gameState.winner ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Player 1</span>
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-600">Position: {gameState.playerPositions[0]}</p>
                </div>
                <div className={`p-3 rounded-lg border-2 ${gameState.currentPlayer === 1 && !gameState.winner ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Player 2</span>
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-600">Position: {gameState.playerPositions[1]}</p>
                </div>
              </div>
            </div>

            {/* Dice and Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center space-y-4">
                {!gameState.gameStarted && (
                  <p className="text-gray-600">Click "Roll Dice" to start!</p>
                )}
                
                {gameState.winner ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2 animate-bounce" />
                      <h3 className="text-2xl font-bold text-green-600">
                        Player {gameState.winner} Wins! 🎉
                      </h3>
                    </div>
                    <Button onClick={resetGame} className="w-full">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Play Again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        {gameState.gameStarted ? `Player ${gameState.currentPlayer + 1}'s Turn` : 'Ready to Play!'}
                      </p>
                      <div className={`inline-block p-4 rounded-lg border-2 ${gameState.isRolling ? 'animate-spin' : ''}`}>
                        {getDiceIcon(gameState.diceValue)}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={rollDice} 
                      disabled={gameState.isRolling}
                      className="w-full"
                      size="lg"
                    >
                      {gameState.isRolling ? 'Rolling...' : 'Roll Dice'}
                    </Button>
                    
                    {gameState.gameStarted && (
                      <Button 
                        onClick={resetGame} 
                        variant="outline" 
                        className="w-full"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Game
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Game Rules */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold mb-3">How to Play</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Roll dice to move forward</li>
                <li>• 🪜 Ladders take you up</li>
                <li>• 🐍 Snakes take you down</li>
                <li>• First to reach 100 wins!</li>
                <li>• Must roll exact number to win</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeAndLaddersGame;
