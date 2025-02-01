"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Briefcase,
  House,
  Info,
  LayoutDashboard,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "./Navmain";
import { NavUser } from "./Navuser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const data = {
    user: {
      name: session?.user?.name || "User",
      email: session?.user?.email || "user@example.com",
      avatar: session?.user?.image || "/avatars/default-avatar.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: "Dashboard",
            url: "/dashboard",
          },
        ],
      },
      {
        title: "Home",
        url: "#",
        icon: House,
        // isActive: true,
        items: [
          {
            title: "List Home",
            url: "/dashboard/home",
          },
          {
            title: "Create Home",
            url: "/dashboard/home/create",
          },
        ],
      },
      {
        title: "About",
        url: "#",
        icon: Info,
        // isActive: true,
        items: [
          {
            title: "List About",
            url: "/dashboard/about",
          },
          {
            title: "Create About",
            url: "/dashboard/about/create",
          },
        ],
      },
      {
        title: "Skills",
        url: "#",
        icon: SquareTerminal,
        items: [
          {
            title: "List Skills",
            url: "/dashboard/skills",
          },
          {
            title: "Create Skills",
            url: "/dashboard/skills/create",
          },
        ],
      },
      {
        title: "Work History",
        url: "#",
        icon: Briefcase,
        items: [
          {
            title: "List Work History",
            url: "/dashboard/work-history",
          },
          {
            title: "Create Work History",
            url: "/dashboard/work-history/create",
          },
        ],
      },
      {
        title: "Projects",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "List Projects",
            url: "/dashboard/projects",
          },
          {
            title: "Create Project",
            url: "/dashboard/projects/create",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div>Hello, {data.user.name}</div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
