import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, FileCode, Folder } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { FileNode } from "../data/mockFileSystem";

type FileTreeProps = {
	data: FileNode[];
	activeRoute?: string;
};

const FileItem = ({
	node,
	depth,
	activeRoute,
}: {
	node: FileNode;
	depth: number;
	activeRoute?: string;
}) => {
	const [isOpen, setIsOpen] = useState(true);
	const isFolder = node.type === "folder";

	// Simple matching logic: if activeRoute matches node.route (handling params loosely for visual highlight)
	// For strict matching we might need regex, but for visual tutorial simple includes/starts might suffice or exact match.
	// Let's assume exact match for now, or we can improve later.
	const isActive =
		node.route && activeRoute
			? activeRoute.includes(node.route.replace(/:[a-zA-Z]+/g, ""))
			: false;

	return (
		<div className="select-none">
			<button
				type="button"
				className={clsx(
					"flex items-center py-1 px-2 rounded cursor-pointer transition-colors w-full text-left border-none bg-transparent",
					isActive
						? "bg-blue-500/20 text-blue-300"
						: "hover:bg-white/5 text-gray-300",
				)}
				style={{ paddingLeft: `${depth * 12 + 8}px` }}
				onClick={() => isFolder && setIsOpen(!isOpen)}
				onKeyDown={(e) => {
					if (isFolder && (e.key === "Enter" || e.key === " ")) {
						setIsOpen(!isOpen);
					}
				}}
			>
				<span className="mr-2 opacity-70">
					{isFolder ? (
						isOpen ? (
							<ChevronDown size={14} />
						) : (
							<ChevronRight size={14} />
						)
					) : (
						<div className="w-3.5" />
					)}
				</span>

				<span className="mr-2">
					{isFolder ? (
						<Folder size={16} className="text-yellow-500/80" />
					) : (
						<FileCode size={16} className="text-blue-400/80" />
					)}
				</span>

				<span
					className={clsx("text-sm", isActive && "font-medium text-blue-200")}
				>
					{node.name}
				</span>

				{node.route && (
					<span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-500 font-mono hidden group-hover:block">
						{node.route}
					</span>
				)}
			</button>

			<AnimatePresence>
				{isFolder && isOpen && node.children && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="overflow-hidden"
					>
						{node.children.map((child, index) => (
							<FileItem
								key={index}
								node={child}
								depth={depth + 1}
								activeRoute={activeRoute}
							/>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export const FileTree: React.FC<FileTreeProps> = ({ data, activeRoute }) => {
	return (
		<div className="w-80 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col flex-1 min-h-0">
			<h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
				Project Structure
			</h2>
			<div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
				{data.map((node, index) => (
					<FileItem
						key={index}
						node={node}
						depth={0}
						activeRoute={activeRoute}
					/>
				))}
			</div>
		</div>
	);
};
