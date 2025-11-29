import React, { useState } from 'react';
import { useNavigationStore } from '../logic/NavigationStore';
import { ArrowRight, Layers, XCircle, RefreshCw, RotateCcw } from 'lucide-react';
import { restaurantFileStructure } from '../data/mockFileSystem';

// Helper to flatten routes for autocomplete/dropdown
const getAllRoutes = (nodes: any[]): string[] => {
  let routes: string[] = [];
  nodes.forEach(node => {
    if (node.route) routes.push(node.route);
    if (node.children) routes = [...routes, ...getAllRoutes(node.children)];
  });
  return routes;
};

const AVAILABLE_ROUTES = getAllRoutes(restaurantFileStructure);

import { useAutoPlayer } from '../hooks/useAutoPlayer';
import { TUTORIAL_SCENARIOS } from '../logic/tutorialScenarios';
import { Play, Square } from 'lucide-react';

export const Controls: React.FC = () => {
  const { navigate, push, replace, dismissTo, goBack, reset, stack } = useNavigationStore();
  const [targetRoute, setTargetRoute] = useState(AVAILABLE_ROUTES[0] || '/');
  const [paramsInput, setParamsInput] = useState('');
  
  const { isPlaying, playScenario, stop, progress } = useAutoPlayer();
  const [selectedScenario, setSelectedScenario] = useState(TUTORIAL_SCENARIOS[0].name);

  const handleAction = (action: 'navigate' | 'push' | 'replace' | 'dismissTo') => {
    if (isPlaying) return; // Disable manual controls during tutorial
    let params = undefined;
    try {
      if (paramsInput) params = JSON.parse(paramsInput);
    } catch (e) {
      console.error("Invalid JSON params");
    }

    switch (action) {
      case 'navigate': navigate(targetRoute, params); break;
      case 'push': push(targetRoute, params); break;
      case 'replace': replace(targetRoute, params); break;
      case 'dismissTo': dismissTo(targetRoute); break;
    }
  };

  return (
    <div className="w-80 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col gap-4">
      {/* Tutorial Section */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Play size={12} /> Auto Tutorial
          </h2>
          <div className="flex flex-col gap-2">
              <select 
                  value={selectedScenario} 
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  disabled={isPlaying}
                  className="bg-black/20 border border-white/10 rounded-md p-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                  {TUTORIAL_SCENARIOS.map(s => (
                      <option key={s.name} value={s.name} className="bg-gray-800">{s.name}</option>
                  ))}
              </select>
              
              {!isPlaying ? (
                  <button 
                      onClick={() => playScenario(selectedScenario)}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded-md text-xs font-medium transition-colors"
                  >
                      <Play size={12} /> Start Scenario
                  </button>
              ) : (
                  <button 
                      onClick={stop}
                      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-1.5 rounded-md text-xs font-medium transition-colors animate-pulse"
                  >
                      <Square size={12} /> Stop ({Math.round(progress)}%)
                  </button>
              )}
          </div>
      </div>

      <div className="h-px bg-white/10" />

      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Manual Controls</h2>
      
      {/* Route Selector */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Target Route</label>
        <select 
          value={targetRoute} 
          onChange={(e) => setTargetRoute(e.target.value)}
          disabled={isPlaying}
          className="bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
        >
          {AVAILABLE_ROUTES.map(r => (
            <option key={r} value={r} className="bg-gray-800">{r}</option>
          ))}
        </select>
      </div>

      {/* Params Input */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Params (JSON)</label>
        <input 
          type="text" 
          placeholder='{"id": "123"}'
          value={paramsInput}
          onChange={(e) => setParamsInput(e.target.value)}
          disabled={isPlaying}
          className="bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono disabled:opacity-50"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button 
          onClick={() => handleAction('navigate')}
          disabled={isPlaying}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:opacity-50 text-white py-2 rounded-md text-sm font-medium transition-colors"
        >
          <ArrowRight size={14} /> Navigate
        </button>
        <button 
          onClick={() => handleAction('push')}
          disabled={isPlaying}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:opacity-50 text-white py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Layers size={14} /> Push
        </button>
        <button 
          onClick={() => handleAction('replace')}
          disabled={isPlaying}
          className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:opacity-50 text-white py-2 rounded-md text-sm font-medium transition-colors"
        >
          <RefreshCw size={14} /> Replace
        </button>
        <button 
          onClick={() => handleAction('dismissTo')}
          disabled={isPlaying}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:opacity-50 text-white py-2 rounded-md text-sm font-medium transition-colors"
        >
          <XCircle size={14} /> DismissTo
        </button>
      </div>

      <div className="h-px bg-white/10 my-2" />

      <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={goBack}
            disabled={stack.length <= 1 || isPlaying}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-md text-sm font-medium transition-colors"
          >
            Go Back
          </button>
          <button 
            onClick={() => reset(targetRoute)}
            disabled={isPlaying}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white py-2 rounded-md text-sm font-medium transition-colors"
          >
            <RotateCcw size={14} /> Reset
          </button>
      </div>
    </div>
  );
};
