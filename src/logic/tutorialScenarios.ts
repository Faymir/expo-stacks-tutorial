

export type TutorialStep = {
  action: 'navigate' | 'push' | 'replace' | 'dismissTo' | 'reset';
  route: string;
  params?: Record<string, any>;
  delay: number; // Time to wait before executing this step
  description?: string; // Optional override for explanation
};

export type Scenario = {
  name: string;
  steps: TutorialStep[];
};

export const TUTORIAL_SCENARIOS: Scenario[] = [
  {
    name: "Full Restaurant Flow",
    steps: [
      { action: 'reset', route: '/auth/login', delay: 1000 },
      { action: 'navigate', route: '/auth/register', delay: 2000 },
      { action: 'navigate', route: '/auth/login', delay: 2000 },
      { action: 'replace', route: '/(main)/tables', delay: 2000 },
      { action: 'navigate', route: '/table/1', delay: 2000 },
      { action: 'push', route: '/table/menu', delay: 2000 },
      { action: 'push', route: '/table/customize/42', delay: 2000 },
      { action: 'dismissTo', route: '/table/1', delay: 3000 },
      { action: 'push', route: '/payment/123', delay: 2000 },
      { action: 'replace', route: '/payment/success', delay: 2000 },
      { action: 'dismissTo', route: '/(main)/tables', delay: 3000 },
    ]
  },
  {
    name: "Auth Flow Only",
    steps: [
      { action: 'reset', route: '/auth/login', delay: 500 },
      { action: 'push', route: '/auth/register', delay: 1500 },
      { action: 'navigate', route: '/auth/login', delay: 1500 },
      { action: 'replace', route: '/(main)/tables', delay: 1500 },
    ]
  },
  {
    name: "Deep Stack & Dismiss",
    steps: [
      { action: 'reset', route: '/(main)/tables', delay: 500 },
      { action: 'navigate', route: '/table/5', delay: 1000 },
      { action: 'push', route: '/table/menu', delay: 1000 },
      { action: 'push', route: '/table/customize/burger', delay: 1000 },
      { action: 'push', route: '/table/customize/burger/toppings', delay: 1000 },
      { action: 'dismissTo', route: '/table/5', delay: 2000 },
    ]
  }
];
