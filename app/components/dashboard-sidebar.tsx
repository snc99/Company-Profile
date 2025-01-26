import { Home, Briefcase, Code2, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ChevronDown } from "lucide-react";

export function AppSidebar() {
  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      submenu: [],
    },
    {
      title: "Home",
      url: "/dashboard/home",
      icon: Home,
      submenu: [
        { label: "Home", url: "/dashboard/home" },
        { label: "Create Data", url: "/dashboard/home/create" },
      ],
    },
    {
      title: "About",
      url: "/dashboard/about",
      icon: User,
      submenu: [
        { label: "About", url: "/dashboard/about" },
        { label: "Create Data", url: "/dashboard/about/create" },
      ],
    },
    {
      title: "Skills",
      url: "/dashboard/skills",
      icon: Code2,
      submenu: [
        { label: "Skills", url: "/dashboard/skills/add" },
        { label: "Create Data", url: "/dashboard/skills/create" },
      ],
    },
    {
      title: "Work History",
      url: "/dashboard/work-history",
      icon: Briefcase,
      submenu: [
        { label: "Work History", url: "/dashboard/work-history/add" },
        { label: "Create Data", url: "/dashboard/work-history/create" },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 p-4">
            {/* Logo */}
            {/* <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" /> */}
            <span className="text-lg font-semibold">Irvan Sandy</span>
          </div>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu.length > 0 ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem, index) => (
                            <SidebarMenuSubItem key={index}>
                              <SidebarMenuButton asChild>
                                <a
                                  href={subItem.url}
                                  className="block px-6 py-2 text-sm hover:bg-gray-100 rounded"
                                >
                                  {subItem.label}
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    // Menambahkan link untuk Dashboard
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url} // Mengarah ke /dashboard
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
