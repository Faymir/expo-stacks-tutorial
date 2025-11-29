import React from 'react';
import { useNavigationStore } from '../logic/NavigationStore';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExplanationPanel: React.FC = () => {
  const lastAction = useNavigationStore((state) => state.lastAction);

  return (
    <div className="w-80 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col h-48">
      <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-2">
        <Info size={14} /> Activity Log
      </h2>
      
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode='wait'>
            {lastAction ? (
                <motion.div
                    key={lastAction.timestamp}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0"
                >
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-blue-400 uppercase">{lastAction.type}</span>
                            <span className="text-[10px] text-gray-500">{new Date(lastAction.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {lastAction.description}
                        </p>
                    </div>
                </motion.div>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-600 text-sm italic">
                    No actions yet...
                </div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};
