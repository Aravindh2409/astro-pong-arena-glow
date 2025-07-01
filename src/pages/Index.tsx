import { useState } from 'react';
import PingPongGame from '@/components/PingPongGame';
import SnakeAndLaddersGame from '@/components/SnakeAndLaddersGame';
import SmartPersonLogo from '@/components/SmartPersonLogo';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentView, setCurrentView] = useState<'logo' | 'game' | 'snake'>('logo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with navigation */}
      <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <SmartPersonLogo size="sm" />
          <div className="flex gap-4">
            <Button 
              variant={currentView === 'logo' ? 'default' : 'outline'}
              onClick={() => setCurrentView('logo')}
            >
              Logo
            </Button>
            <Button 
              variant={currentView === 'game' ? 'default' : 'outline'}
              onClick={() => setCurrentView('game')}
            >
              Ping Pong Game
            </Button>
            <Button 
              variant={currentView === 'snake' ? 'default' : 'outline'}
              onClick={() => setCurrentView('snake')}
            >
              Snake & Ladders
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {currentView === 'logo' ? (
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Smart Person Logo</h1>
              <p className="text-gray-600">AI-powered interview platform with video feedback</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Logo Examples */}
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Logo Variations</h2>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Large Full Logo</h3>
                  <SmartPersonLogo size="lg" />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Medium Full Logo</h3>
                  <SmartPersonLogo size="md" />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Small Full Logo</h3>
                  <SmartPersonLogo size="sm" />
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Icon & Text Variants</h2>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Icon Only</h3>
                  <SmartPersonLogo variant="icon" size="lg" />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Text Only</h3>
                  <SmartPersonLogo variant="text" size="lg" />
                </div>

                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">On Dark Background</h3>
                  <SmartPersonLogo size="md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : currentView === 'game' ? (
        <PingPongGame />
      ) : (
        <SnakeAndLaddersGame />
      )}
    </div>
  );
};

export default Index;
