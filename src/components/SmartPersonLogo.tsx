
import React from 'react';
import { Brain, Video, MessageSquare, Sparkles } from 'lucide-react';

interface SmartPersonLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const SmartPersonLogo: React.FC<SmartPersonLogoProps> = ({ 
  size = 'md', 
  variant = 'full', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: { container: 'h-8', icon: 'w-6 h-6', text: 'text-lg', subtext: 'text-xs' },
    md: { container: 'h-12', icon: 'w-8 h-8', text: 'text-2xl', subtext: 'text-sm' },
    lg: { container: 'h-16', icon: 'w-12 h-12', text: 'text-3xl', subtext: 'text-base' },
    xl: { container: 'h-20', icon: 'w-16 h-16', text: 'text-4xl', subtext: 'text-lg' }
  };

  const currentSize = sizeClasses[size];

  if (variant === 'icon') {
    return (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
          <Brain className={`${currentSize.icon} text-white`} />
          <div className="absolute top-1 right-1">
            <Sparkles className="w-3 h-3 text-yellow-300" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex flex-col ${className}`}>
        <h1 className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${currentSize.text}`}>
          Smart Person
        </h1>
        <p className={`text-gray-600 font-medium ${currentSize.subtext}`}>
          AI Interview Assistant
        </p>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className={`relative flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg ${currentSize.container} aspect-square`}>
          <Brain className={`${currentSize.icon} text-white`} />
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
            <Sparkles className="w-3 h-3 text-yellow-800" />
          </div>
        </div>
        <div className="absolute -bottom-1 -right-2 flex gap-1">
          <div className="bg-green-500 rounded-full p-1">
            <Video className="w-3 h-3 text-white" />
          </div>
          <div className="bg-orange-500 rounded-full p-1">
            <MessageSquare className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${currentSize.text}`}>
          Smart Person
        </h1>
        <p className={`text-gray-600 font-medium ${currentSize.subtext}`}>
          AI Interview Assistant
        </p>
      </div>
    </div>
  );
};

export default SmartPersonLogo;
