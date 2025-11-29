import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { FileTree } from './components/FileTree';
import { StackVisualizer } from './components/StackVisualizer';
import { Controls } from './components/Controls';
import { ExplanationPanel } from './components/ExplanationPanel';
import { restaurantFileStructure } from './data/mockFileSystem';
import { useNavigationStore } from './logic/NavigationStore';

function App() {
  const stack = useNavigationStore((state) => state.stack);
  const reset = useNavigationStore((state) => state.reset);

  // Initialize with a default route if empty
  useEffect(() => {
      if (stack.length === 0) {
          reset('/(main)/tables');
      }
  }, []);

  // Get current active route for file tree highlighting
  const currentRoute = stack.length > 0 ? stack[stack.length - 1].route : undefined;

  return (
    <Layout>
      {/* Left Panel: File Structure & Explanation */}
      <div className="flex flex-col gap-6 h-full">
        <FileTree data={restaurantFileStructure} activeRoute={currentRoute} />
        <ExplanationPanel />
      </div>

      {/* Center: Stack Visualization */}
      <StackVisualizer />

      {/* Right Panel: Controls */}
      <div className="flex flex-col gap-6 h-full justify-center">
        <Controls />
        
        {/* Legend / Tips */}
        <div className="w-80 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-gray-400">
            <h3 className="font-bold text-gray-300 mb-2">Quick Tips</h3>
            <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-blue-400">Navigate</strong>: Go to screen. If exists, pop back to it.</li>
                <li><strong className="text-purple-400">Push</strong>: Always add new screen on top.</li>
                <li><strong className="text-orange-400">Replace</strong>: Swap current screen with new one.</li>
                <li><strong className="text-red-400">DismissTo</strong>: Pop until specific screen is reached.</li>
            </ul>
        </div>
      </div>
    </Layout>
  );
}

export default App;
