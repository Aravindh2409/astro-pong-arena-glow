
import React from 'react';
import SmartPersonLogo from '@/components/SmartPersonLogo';

const Logo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Smart Person Logo Variations</h1>
          <p className="text-gray-600">AI-powered interview platform with video feedback</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Full Logo Variations */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Full Logo</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Extra Large</h3>
              <SmartPersonLogo size="xl" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Large</h3>
              <SmartPersonLogo size="lg" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Medium</h3>
              <SmartPersonLogo size="md" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Small</h3>
              <SmartPersonLogo size="sm" />
            </div>
          </div>

          {/* Icon and Text Only Variations */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variations</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Icon Only - Large</h3>
              <SmartPersonLogo variant="icon" size="lg" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Icon Only - Medium</h3>
              <SmartPersonLogo variant="icon" size="md" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Text Only - Large</h3>
              <SmartPersonLogo variant="text" size="lg" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Text Only - Medium</h3>
              <SmartPersonLogo variant="text" size="md" />
            </div>

            {/* Dark Background Examples */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300 mb-4">On Dark Background</h3>
              <SmartPersonLogo size="md" />
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Usage Examples</h2>
          
          {/* Header Example */}
          <div className="bg-white border rounded-lg mb-6">
            <div className="border-b p-4 flex items-center justify-between">
              <SmartPersonLogo size="sm" />
              <nav className="flex gap-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              </nav>
            </div>
            <div className="p-8 text-center">
              <SmartPersonLogo size="xl" className="mx-auto mb-6" />
              <p className="text-gray-600 max-w-2xl mx-auto">
                Revolutionize your interview process with AI-powered assistance and comprehensive video feedback analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
