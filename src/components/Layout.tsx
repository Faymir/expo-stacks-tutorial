import type React from "react";
import { Github } from "lucide-react";

type LayoutProps = {
	children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans overflow-hidden flex flex-col">
			<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

			<header className="p-6 border-b border-white/10 backdrop-blur-md bg-white/5 sticky top-0 z-10 flex justify-between items-center">
				<div className="flex items-center gap-4">
					<h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
						Expo Navigation{" "}
						<span className="text-white/60 font-normal text-lg">
							Interactive Tutorial
						</span>
					</h1>
					<div className="text-sm text-white/40">v1.0.0</div>
				</div>
				<a
					href="https://github.com/Faymir/expo-stacks-tutorial"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
					aria-label="View on GitHub"
				>
					<Github size={20} />
					<span className="text-sm font-medium hidden sm:inline">
						Star on GitHub
					</span>
				</a>
			</header>

			<main className="flex-1 p-6 flex gap-6 overflow-hidden">
				{children}
			</main>
		</div>
	);
};
