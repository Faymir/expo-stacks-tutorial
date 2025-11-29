import { useState, useEffect, useCallback } from 'react';
import { useNavigationStore } from '../logic/NavigationStore';
import { TUTORIAL_SCENARIOS, type Scenario } from '../logic/tutorialScenarios';

export const useAutoPlayer = () => {
  const { navigate, push, replace, dismissTo, reset } = useNavigationStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const playScenario = useCallback((scenarioName: string) => {
    const scenario = TUTORIAL_SCENARIOS.find(s => s.name === scenarioName);
    if (scenario) {
      setCurrentScenario(scenario);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    }
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentScenario(null);
    setCurrentStepIndex(0);
  }, []);

  useEffect(() => {
    if (!isPlaying || !currentScenario) return;

    if (currentStepIndex >= currentScenario.steps.length) {
      stop();
      return;
    }

    const step = currentScenario.steps[currentStepIndex];
    
    const timer = setTimeout(() => {
      switch (step.action) {
        case 'navigate': navigate(step.route, step.params); break;
        case 'push': push(step.route, step.params); break;
        case 'replace': replace(step.route, step.params); break;
        case 'dismissTo': dismissTo(step.route); break;
        case 'reset': reset(step.route); break;
      }
      setCurrentStepIndex(prev => prev + 1);
    }, step.delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentScenario, currentStepIndex, navigate, push, replace, dismissTo, reset, stop]);

  return { isPlaying, playScenario, stop, currentScenario, progress: currentScenario ? (currentStepIndex / currentScenario.steps.length) * 100 : 0 };
};
