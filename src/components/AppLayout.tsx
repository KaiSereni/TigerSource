'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Users } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import tiger from "@/assets/Roaring Tiger_rgb.png"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <img src={tiger.src} className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-primary">TigerSource</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/'}
                tooltip="Resource Finder"
              >
                <Link href="/">
                  <div className="flex items-center gap-2">
                    <Search />
                    <span>Resource Finder</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/clubs'}
                tooltip="Club Finder"
              >
                <Link href="/clubs">
                  <div className="flex items-center gap-2">
                    <Users />
                    <span>Club Finder</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/profile'}
                tooltip="Profile"
              >
                <Link href="/profile">
                  <div className="flex items-center gap-2">
                    <User />
                    <span>Your Profile</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            {/* Can add footer items later */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <SidebarTrigger size="icon" variant="outline" className="h-8 w-8">
                <img src={tiger.src} className="h-5 w-5" />
            </SidebarTrigger>
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
