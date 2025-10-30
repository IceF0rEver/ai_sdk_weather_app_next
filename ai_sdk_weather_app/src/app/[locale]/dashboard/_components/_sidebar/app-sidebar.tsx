"use client";

import { BotMessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";
import { NavUser } from "./nav-user";

interface NavItem {
	title: string;
	url: string;
	icon: React.ReactNode;
	items?: NavItem[];
}

const NavUserSkeleton = () => {
	return (
		<div className="flex flex-row gap-1 w-full h-12 rounded-lg dark:bg-zinc-800 bg-zinc-200 p-2">
			<span className="w-10 aspect-square rounded-lg dark:bg-zinc-700 bg-zinc-300"></span>
			<div className="grid gap-1 w-full p-1">
				<span className="rounded-full w-3/5 dark:bg-zinc-700 bg-zinc-300"></span>
				<span className="rounded-full w-4/5 dark:bg-zinc-700 bg-zinc-300"></span>
			</div>
		</div>
	);
};

export function AppSidebar() {
	const { data: session, isPending } = useSession();
	const t = useI18n();
	const pathname = usePathname();

	const dataSideBar = useMemo(
		(): { navMain: NavItem[] } => ({
			navMain: [
				{
					title: t("components.appSideBar.chatBot"),
					url: "",
					icon: <BotMessageSquare />,
				},
			],
		}),
		[t],
	);

	const dataUser = {
		name: session?.user.name || "",
		email: session?.user.email || "",
		avatar: session?.user.image || "./",
	};

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex gap-2 justify-center items-center bg-sidebar-accent rounded-lg w-full">
					{/* <Image
						src=""
						width={250}
						height={250}
						alt="Logo picture"
						className="w-1/3"
					/> */}
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu className="p-1">
					{dataSideBar?.navMain.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								isActive={!item.items && pathname.includes(item.url)}
								className="transition-shadow data-[active=true]:shadow data-[active=true]:hover:shadow-2xl"
							>
								<Link href={`/dashboard/${item.url}`}>
									{item.icon}
									{item.title}
								</Link>
							</SidebarMenuButton>
							{item.items?.length ? (
								<SidebarMenuSub>
									{item.items?.map((item) => (
										<SidebarMenuSubItem key={item.title}>
											<SidebarMenuSubButton
												asChild
												isActive={
													pathname.split("/").at(-1) ===
													item.url?.split("/").at(-1)
												}
												className="transition-shadow data-[active=true]:shadow data-[active=true]:hover:shadow-2xl"
											>
												<Link href={`/dashboard/${item.url}`}>
													{item.icon}
													{item.title}
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							) : null}
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				{isPending ? <NavUserSkeleton /> : <NavUser user={dataUser} />}
			</SidebarFooter>
		</Sidebar>
	);
}
