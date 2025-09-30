import React from 'react';
import { useTab } from '../../contexts/TabContext';

export const Tabs: React.FC = () => {
  const { activeTab, setActiveTab } = useTab();

  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'main'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            🎨 Main IDE
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'playground'
                ? 'border-purple-500 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            🧪 Component Playground
          </button>
        </div>
      </div>
    </div>
  );
};