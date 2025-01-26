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

export function AppSidebar() {
  const menuItems = [
    {
      title: "Home",
      url: "/dashboard/home",
      icon: Home,
      submenu: [
        { label: "Create", url: "/dashboard/home/create" },
        { label: "Read", url: "/dashboard/home/read" },
        { label: "Update", url: "/dashboard/home/update" },
        { label: "Delete", url: "/dashboard/home/delete" },
      ],
    },
    {
      title: "About",
      url: "/dashboard/about",
      icon: User,
      submenu: [
        { label: "Create", url: "/dashboard/about/create" },
        { label: "Read", url: "/dashboard/about/read" },
        { label: "Update", url: "/dashboard/about/update" },
        { label: "Delete", url: "/dashboard/about/delete" },
      ],
    },
    {
      title: "Skills",
      url: "/dashboard/skills",
      icon: Code2,
      submenu: [
        { label: "Create", url: "/dashboard/skills/create" },
        { label: "Read", url: "/dashboard/skills/read" },
        { label: "Update", url: "/dashboard/skills/update" },
        { label: "Delete", url: "/dashboard/skills/delete" },
      ],
    },
    {
      title: "Work History",
      url: "/dashboard/work-history",
      icon: Briefcase,
      submenu: [
        { label: "Create", url: "/dashboard/work-history/create" },
        { label: "Read", url: "/dashboard/work-history/read" },
        { label: "Update", url: "/dashboard/work-history/update" },
        { label: "Delete", url: "/dashboard/work-history/delete" },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 p-4">
            {/* <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            /> */}
            <span className="text-lg font-semibold">Irvan Sandy</span>
          </div>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <Collapsible
                  key={item.title}
                  defaultOpen
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {/* Trigger untuk menu utama */}
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {/* Submenu CRUD */}
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
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
