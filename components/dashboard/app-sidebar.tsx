import { Calendar, Home, Inbox, Search, Settings, Download, Dog } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Quick Guide",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Jobs",
    url: "/dashboard/jobs",
    icon: Calendar,
  },
  {
    title: "Backstage",
    url: "#",
    icon: Search,
  },
  {
    title: "Team",
    url: "#",
    icon: Settings,
  },
  {
    title: "Jija",
    url: "#",
    icon: Dog,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>EcoF:re</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton size={"lg"} asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size={"lg"} asChild>
                    <a href="#">
                    <Settings />
                    <span>Settings</span>
                    </a>
                </SidebarMenuButton>
                <SidebarMenuButton size={"lg"} asChild>
                    <a href="#">
                    <Download />
                    <span>Business Success Plan
                    </span>
                    </a>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
