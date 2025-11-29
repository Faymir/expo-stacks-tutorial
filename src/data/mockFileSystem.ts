export type FileNode = {
	name: string;
	type: "file" | "folder";
	children?: FileNode[];
	route?: string; // The route this file corresponds to (e.g., /table/[id])
};

export const restaurantFileStructure: FileNode[] = [
	{
		name: "app",
		type: "folder",
		children: [
			{ name: "_layout.tsx", type: "file" },
			{ name: "index.tsx", type: "file", route: "/" },
			{
				name: "auth",
				type: "folder",
				children: [
					{ name: "_layout.tsx", type: "file" },
					{ name: "login.tsx", type: "file", route: "/auth/login" },
					{ name: "register.tsx", type: "file", route: "/auth/register" },
					{
						name: "forgot-password.tsx",
						type: "file",
						route: "/auth/forgot-password",
					},
				],
			},
			{
				name: "(main)",
				type: "folder",
				children: [
					{ name: "_layout.tsx", type: "file" },
					{ name: "tables.tsx", type: "file", route: "/(main)/tables" },
					{ name: "orders.tsx", type: "file", route: "/(main)/orders" },
					{ name: "settings.tsx", type: "file", route: "/(main)/settings" },
				],
			},
			{
				name: "table",
				type: "folder",
				children: [
					{ name: "[id].tsx", type: "file", route: "/table/:id" },
					{ name: "menu.tsx", type: "file", route: "/table/menu" },
					{
						name: "customize",
						type: "folder",
						children: [
							{
								name: "[itemId].tsx",
								type: "file",
								route: "/table/customize/:itemId",
							},
						],
					},
				],
			},
			{
				name: "payment",
				type: "folder",
				children: [
					{ name: "[orderId].tsx", type: "file", route: "/payment/:orderId" },
					{ name: "success.tsx", type: "file", route: "/payment/success" },
				],
			},
		],
	},
];
