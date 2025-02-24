// <<<<<<< HEAD
"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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
  const pathname = usePathname();

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
        isActive: pathname === "/dashboard",
        items: [
          {
            title: "Dashboard",
            url: "/dashboard",
            isActive: pathname === "/dashboard",
          },
        ],
      },
      {
        title: "Home",
        url: "#",
        icon: House,
        isActive: pathname.startsWith("/dashboard/home"),
        items: [
          {
            title: "List Home",
            url: "/dashboard/home",
            isActive: pathname === "/dashboard/home",
          },
          {
            title: "Create Personal Info",
            url: "/dashboard/home/create-personal-info",
            isActive: pathname === "/dashboard/home/create-personal-info",
          },
          {
            title: "Create Social Media",
            url: "/dashboard/home/create-sosmed",
            isActive: pathname === "/dashboard/home/create-sosmed",
          },
        ],
      },
      {
        title: "About",
        url: "#",
        icon: Info,
        isActive: pathname.startsWith("/dashboard/about"),
        items: [
          {
            title: "List About",
            url: "/dashboard/about",
            isActive: pathname === "/dashboard/about",
          },
          {
            title: "Create About",
            url: "/dashboard/about/create",
            isActive: pathname === "/dashboard/about/create",
          },
        ],
      },
      {
        title: "Skills",
        url: "#",
        icon: SquareTerminal,
        isActive: pathname.startsWith("/dashboard/skills"),
        items: [
          {
            title: "List Skills",
            url: "/dashboard/skills",
            isActive: pathname === "/dashboard/skills",
          },
          {
            title: "Create Skills",
            url: "/dashboard/skills/create",
            isActive: pathname === "/dashboard/skills/create",
          },
        ],
      },
      {
        title: "Work Experience",
        url: "#",
        icon: Briefcase,
        isActive: pathname.startsWith("/dashboard/work-experience"),
        items: [
          {
            title: "List Work Experiance",
            url: "/dashboard/work-experience",
            isActive: pathname === "/dashboard/work-experience",
          },
          {
            title: "Create Work Experience",
            url: "/dashboard/work-experience/create",
            isActive: pathname === "/dashboard/work-experience/create",
          },
        ],
      },
      {
        title: "Projects",
        url: "#",
        icon: Settings2,
        isActive: pathname.startsWith("/dashboard/project"),
        items: [
          {
            title: "List Project",
            url: "/dashboard/project",
            isActive: pathname === "/dashboard/project",
          },
          {
            title: "Create Project",
            url: "/dashboard/project/create",
            isActive: pathname === "/dashboard/project/create",
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
// =======
// "use client";

// import * as React from "react";
// import { useSession } from "next-auth/react";
// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";

// import {
//   Briefcase,
//   House,
//   Info,
//   LayoutDashboard,
//   Settings2,
//   SquareTerminal,
// } from "lucide-react";

// import { NavMain } from "./Navmain";
// import { NavUser } from "./Navuser";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
// } from "@/components/ui/sidebar";

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/auth/login");
//     }
//   }, [status, router]);

//   if (status === "loading") {
//     return <p>Loading...</p>;
//   }

//   const data = {
//     user: {
//       name: session?.user?.name || "User",
//       email: session?.user?.email || "user@example.com",
//       avatar: session?.user?.image || "/avatars/default-avatar.jpg",
//     },
//     navMain: [
//       {
//         title: "Dashboard",
//         url: "/dashboard",
//         icon: LayoutDashboard,
//         isActive: pathname === "/dashboard",
//         items: [
//           {
//             title: "Dashboard",
//             url: "/dashboard",
//             isActive: pathname === "/dashboard",
//           },
//         ],
//       },
//       {
//         title: "Home",
//         url: "#",
//         icon: House,
//         isActive: pathname.startsWith("/dashboard/home"),
//         items: [
//           {
//             title: "List Home",
//             url: "/dashboard/home",
//             isActive: pathname === "/dashboard/home",
//           },
//           {
//             title: "Create Home",
//             url: "/dashboard/home/create",
//             isActive: pathname === "/dashboard/home/create",
//           },
//           {
//             title: "Create Social Media", // 🔹 Submenu baru
//             url: "/dashboard/home/create-sosmed", // URL baru untuk Create Social Media
//             isActive: pathname === "/dashboard/home/create-sosmed",
//           },
//         ],
//       },
//       {
//         title: "About",
//         url: "#",
//         icon: Info,
//         isActive: pathname.startsWith("/dashboard/about"),
//         items: [
//           {
//             title: "List About",
//             url: "/dashboard/about",
//             isActive: pathname === "/dashboard/about",
//           },
//           {
//             title: "Create About",
//             url: "/dashboard/about/create",
//             isActive: pathname === "/dashboard/about/create",
//           },
//         ],
//       },
//       {
//         title: "Skills",
//         url: "#",
//         icon: SquareTerminal,
//         isActive: pathname.startsWith("/dashboard/skills"),
//         items: [
//           {
//             title: "List Skills",
//             url: "/dashboard/skills",
//             isActive: pathname === "/dashboard/skills",
//           },
//           {
//             title: "Create Skills",
//             url: "/dashboard/skills/create",
//             isActive: pathname === "/dashboard/skills/create",
//           },
//         ],
//       },
//       {
//         title: "Work History",
//         url: "#",
//         icon: Briefcase,
//         isActive: pathname.startsWith("/dashboard/work-history"),
//         items: [
//           {
//             title: "List Work History",
//             url: "/dashboard/work-history",
//             isActive: pathname === "/dashboard/work-history",
//           },
//           {
//             title: "Create Work History",
//             url: "/dashboard/work-history/create",
//             isActive: pathname === "/dashboard/work-history/create",
//           },
//         ],
//       },
//       {
//         title: "Projects",
//         url: "#",
//         icon: Settings2,
//         isActive: pathname.startsWith("/dashboard/projects"),
//         items: [
//           {
//             title: "List Projects",
//             url: "/dashboard/projects",
//             isActive: pathname === "/dashboard/projects",
//           },
//           {
//             title: "Create Project",
//             url: "/dashboard/projects/create",
//             isActive: pathname === "/dashboard/projects/create",
//           },
//         ],
//       },
//     ],
//   };

//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <div>Hello, {data.user.name}</div>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={data.navMain} />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }
// >>>>>>> 7345024b9077eb224df0c942e66c3ec97f934740
