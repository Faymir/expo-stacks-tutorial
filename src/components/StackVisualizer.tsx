import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useNavigationStore } from "../logic/NavigationStore";

export const StackVisualizer: React.FC = () => {
	const stack = useNavigationStore((state) => state.stack);
	const lastAction = useNavigationStore((state) => state.lastAction);

	// Determine animation variants based on the last action
	const getVariants = (index: number) => {
		const actionType = lastAction?.type;
		const meta = lastAction?.meta;

		// Default Push/Navigate animation (Slower)
		// biome-ignore lint/suspicious/noExplicitAny: Framer Motion variant types are complex
		let initial: any = { opacity: 0, x: 50, scale: 0.95 };
		// biome-ignore lint/suspicious/noExplicitAny: Framer Motion variant types are complex
		let animate: any = { opacity: 1, x: 0, scale: 1, zIndex: index };
		// biome-ignore lint/suspicious/noExplicitAny: Framer Motion variant types are complex
		let exit: any = { opacity: 0, scale: 0.9, transition: { duration: 0.5 } }; // Slower default exit
		// biome-ignore lint/suspicious/noExplicitAny: Framer Motion variant types are complex
		let transition: any = {
			type: "spring",
			stiffness: 100,
			damping: 20,
			mass: 1.2,
		}; // Slower spring

		if (actionType === "replace") {
			// Replace: New slides in from right, Old slides out to left (Slower)
			initial = { opacity: 0, x: 100, scale: 1 };
			animate = { opacity: 1, x: 0, scale: 1, zIndex: index };
			exit = {
				opacity: 0,
				x: -100,
				scale: 0.9,
				transition: { duration: 0.8, ease: "easeInOut" },
			};
			transition = { duration: 0.8, ease: "circOut" };
		} else if (
			actionType === "dismissTo" &&
			meta?.previousLength &&
			meta?.targetIndex !== undefined
		) {
			// DismissTo: Sequential popping AFTER arrow animation
			// Arrow animation duration approx 1.5s
			// Then pop top (highest index), then next down...

			// If this item is being removed (it's in the exit phase), its index is > targetIndex
			// We want top (meta.previousLength - 1) to go first.
			// Delay = ArrowDuration + (meta.previousLength - 1 - index) * 0.5s

			const arrowDuration = 1.5;
			const stepDelay = 0.5;
			const delay =
				arrowDuration + (meta.previousLength - 1 - index) * stepDelay;

			exit = {
				opacity: 0,
				scale: [1, 1.1, 0], // Pop effect: slight swell then shrink to nothing
				transition: {
					duration: 0.4,
					delay: delay,
					times: [0, 0.2, 1], // Timing for the scale keyframes
				},
			};
		}

		return { initial, animate, exit, transition };
	};

	// Calculate arrow path for dismissTo
	const getDismissArrowPath = (): { path: string; targetY: number } | null => {
		if (
			lastAction?.type !== "dismissTo" ||
			!lastAction.meta?.previousLength ||
			lastAction.meta.targetIndex === undefined
		)
			return null;

		const { previousLength, targetIndex } = lastAction.meta;

		const heightPerItem = 120; // Rough guess
		const topY = 60; // Center of top card
		const targetY = topY + (previousLength - 1 - targetIndex) * heightPerItem;

		return {
			path: `M 10 ${topY} Q 100 ${(topY + targetY) / 2} 10 ${targetY}`,
			targetY,
		};
	};

	const arrowData = getDismissArrowPath();

	return (
		<div className="flex-1 relative flex flex-col items-center justify-start overflow-y-auto p-8 custom-scrollbar h-full">
			<div className="w-full max-w-md flex flex-col-reverse gap-4 pb-20 relative min-h-[500px] justify-end">
				<AnimatePresence mode="popLayout" custom={lastAction?.type}>
					{stack.map((screen, index) => {
						const isTop = index === stack.length - 1;
						const variants = getVariants(index);

						return (
							<motion.div
								key={screen.id}
								layout
								custom={index} // Pass index to variants
								initial={variants.initial}
								animate={variants.animate}
								exit={variants.exit}
								transition={variants.transition}
								className={clsx(
									"w-full rounded-2xl shadow-xl overflow-hidden border relative shrink-0",
									isTop
										? "border-blue-500/50 ring-2 ring-blue-500/20 bg-gray-800"
										: "border-white/5 bg-gray-900/80 opacity-80 hover:opacity-100 transition-opacity",
								)}
								style={{ height: 100 }} // Fixed height for consistent animation
							>
								{/* Header */}
								<div
									className={clsx(
										"h-10 flex items-center px-4 border-b",
										isTop
											? "bg-blue-500/10 border-blue-500/20"
											: "bg-white/5 border-white/5",
									)}
								>
									<div
										className={clsx(
											"w-5 h-5 rounded-full flex items-center justify-center mr-3 text-[10px] font-bold",
											isTop
												? "bg-blue-500 text-white"
												: "bg-gray-700 text-gray-400",
										)}
									>
										{index + 1}
									</div>
									<span
										className={clsx(
											"font-semibold truncate flex-1 text-sm",
											isTop ? "text-blue-100" : "text-gray-400",
										)}
									>
										{screen.route}
									</span>
								</div>

								{/* Content Body */}
								<div className="p-3">
									<p className="text-[10px] text-gray-500 font-mono mb-1">
										ID: {screen.id}
									</p>
									{screen.params && (
										<p className="text-[10px] text-green-400 font-mono truncate">
											{JSON.stringify(screen.params)}
										</p>
									)}
								</div>
							</motion.div>
						);
					})}
				</AnimatePresence>

				{/* Curved Arrow Overlay */}
				<AnimatePresence>
					{lastAction?.type === "dismissTo" && arrowData && (
						<div className="absolute right-[-100px] top-0 bottom-0 w-[100px] pointer-events-none z-50">
							<svg
								className="w-full h-full overflow-visible"
								role="img"
								aria-label="Dismiss animation arrow"
							>
								<title>Dismiss animation arrow</title>
								<defs>
									<marker
										id="arrowhead"
										markerWidth="10"
										markerHeight="7"
										refX="0"
										refY="3.5"
										orient="auto"
									>
										<polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
									</marker>
								</defs>
								<motion.path
									d={arrowData.path}
									fill="none"
									stroke="#ef4444"
									strokeWidth="4"
									markerEnd="url(#arrowhead)"
									initial={{ pathLength: 0, opacity: 0 }}
									animate={{ pathLength: 1, opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 1.5, ease: "easeInOut" }}
								/>
							</svg>
						</div>
					)}
				</AnimatePresence>

				{stack.length === 0 && (
					<div className="text-white/20 text-center mt-20">
						<p className="text-lg">Stack is empty</p>
						<p className="text-sm">Use controls to navigate</p>
					</div>
				)}
			</div>
		</div>
	);
};
