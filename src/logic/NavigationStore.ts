import { create } from "zustand";

export type Screen = {
	id: string;
	route: string;
	params?: Record<string, unknown>;
};

export type LastAction = {
	type: "navigate" | "push" | "replace" | "dismissTo" | "goBack" | "reset";
	description: string;
	timestamp: number;
	meta?: {
		previousLength?: number;
		targetIndex?: number;
		removedCount?: number;
	};
};

type NavigationState = {
	stack: Screen[];

	lastAction?: LastAction;

	// Actions
	navigate: (route: string, params?: Record<string, unknown>) => void;
	push: (route: string, params?: Record<string, unknown>) => void;
	replace: (route: string, params?: Record<string, unknown>) => void;
	dismissTo: (route: string) => void;
	goBack: () => void;
	reset: (route: string) => void;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useNavigationStore = create<NavigationState>((set) => ({
	stack: [],
	lastAction: undefined,

	navigate: (route, params) => {
		set((state) => {
			const existingIndex = state.stack.findIndex((s) => s.route === route);

			if (existingIndex !== -1) {
				return {
					stack: state.stack.slice(0, existingIndex + 1),
					lastAction: {
						type: "navigate",
						description: `Navigated to existing route "${route}". Popped ${state.stack.length - 1 - existingIndex} screens.`,
						timestamp: Date.now(),
					},
				};
			}

			return {
				stack: [...state.stack, { id: generateId(), route, params }],
				lastAction: {
					type: "navigate",
					description: `Navigated to new route "${route}". Pushed to stack.`,
					timestamp: Date.now(),
				},
			};
		});
	},

	push: (route, params) => {
		set((state) => ({
			stack: [...state.stack, { id: generateId(), route, params }],
			lastAction: {
				type: "push",
				description: `Pushed "${route}" to top of stack.`,
				timestamp: Date.now(),
			},
		}));
	},

	replace: (route, params) => {
		set((state) => {
			if (state.stack.length === 0) {
				return {
					stack: [{ id: generateId(), route, params }],
					lastAction: {
						type: "replace",
						description: `Replaced empty stack with "${route}".`,
						timestamp: Date.now(),
					},
				};
			}
			const newStack = [...state.stack];
			const oldRoute = newStack[newStack.length - 1].route;
			newStack[state.stack.length - 1] = { id: generateId(), route, params };
			return {
				stack: newStack,
				lastAction: {
					type: "replace",
					description: `Replaced "${oldRoute}" with "${route}".`,
					timestamp: Date.now(),
				},
			};
		});
	},

	dismissTo: (route) => {
		set((state) => {
			const targetIndex = state.stack.findIndex((s) => s.route === route);
			if (targetIndex !== -1) {
				return {
					stack: state.stack.slice(0, targetIndex + 1),
					lastAction: {
						type: "dismissTo",
						description: `Dismissed ${state.stack.length - 1 - targetIndex} screens to reach "${route}".`,
						timestamp: Date.now(),
						meta: {
							previousLength: state.stack.length,
							targetIndex: targetIndex,
							removedCount: state.stack.length - 1 - targetIndex,
						},
					},
				};
			} else {
				// Expo Router behavior: If not found, replace current screen
				const newScreen: Screen = {
					id: generateId(),
					route,
					params: undefined, // dismissTo does not provide params
				};
				const newStack = [...state.stack];
				if (newStack.length > 0) {
					newStack[newStack.length - 1] = newScreen;
				} else {
					newStack.push(newScreen);
				}

				return {
					stack: newStack,
					lastAction: {
						type: "dismissTo",
						description: `Route "${route}" not found in stack. Replaced top screen.`,
						timestamp: Date.now(),
						meta: {
							previousLength: state.stack.length,
							targetIndex: state.stack.length - 1, // It's effectively a replace at the top
						},
					},
				};
			}
		});
	},

	goBack: () => {
		set((state) => {
			if (state.stack.length <= 1) return {};
			return {
				stack: state.stack.slice(0, -1),
				lastAction: {
					type: "goBack",
					description: `Went back one screen.`,
					timestamp: Date.now(),
				},
			};
		});
	},

	reset: (route) => {
		set({
			stack: [{ id: generateId(), route }],
			lastAction: {
				type: "reset",
				description: `Reset stack to "${route}".`,
				timestamp: Date.now(),
			},
		});
	},
}));
