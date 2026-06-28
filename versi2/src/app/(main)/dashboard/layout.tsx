import type { ReactNode } from "react";

import { cookies } from "next/headers";
import Link from "next/link";

import { Mail, MessageSquare } from "lucide-react";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SIDEBAR_COLLAPSIBLE_VALUES, SIDEBAR_VARIANT_VALUES } from "@/lib/preferences/layout";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";

import { AddShortcutButton } from "./_components/sidebar/add-shortcut-button";
import { HeaderLeft } from "./_components/sidebar/header-left";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const [variant, collapsible, showSidebarTrigger] = await Promise.all([
    getPreference("sidebar_variant", SIDEBAR_VARIANT_VALUES, "inset"),
    getPreference("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
    getPreference("show_sidebar_trigger", ["true", "false"], "true"),
  ]);

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 68)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant={variant} collapsible={collapsible} />
      <SidebarInset
        className={cn(
          "[html[data-content-layout=centered]_&>*]:mx-auto",
          "[html[data-content-layout=centered]_&>*]:w-full",
          "[html[data-content-layout=centered]_&>*]:max-w-screen-2xl",
          "peer-data-[variant=inset]:border",
          "[--dashboard-header-height:--spacing(12)]",
          "flex min-w-0 flex-col overflow-hidden",
          "max-h-svh peer-data-[variant=inset]:max-h-[calc(100svh-var(--spacing)*4)] peer-data-[variant=default]:max-h-[calc(100svh-var(--spacing)*4)]",
        )}
      >
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            // Handle sticky navbar style with conditional classes so blur, background, z-index, and rounded corners remain consistent across all SidebarVariant layouts.
            "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
            "[html[data-sidebar-variant=default]_&]:border-b-0 [html[data-sidebar-variant=default]_&]:bg-transparent [html[data-sidebar-variant=default]_&]:backdrop-blur-none",
            "[html[data-sidebar-variant=default][data-navbar-style=sticky]_&]:bg-transparent [html[data-sidebar-variant=default][data-navbar-style=sticky]_&]:backdrop-blur-none",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <HeaderLeft initialShow={showSidebarTrigger === "true"} />
            <div className="flex items-center gap-2">
              <Button variant="secondary" asChild>
                <Link href="/dashboard/chat" prefetch={false}>
                  <MessageSquare />
                  <span>Chat</span>
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/dashboard/mail" prefetch={false}>
                  <Mail />
                  <span>Mail</span>
                </Link>
              </Button>
              <AddShortcutButton />
            </div>
          </div>
        </header>

        {/* Content Card Wrapper */}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col overflow-hidden bg-transparent [html[data-sidebar-variant=default]_&]:bg-background",
            "[html[data-sidebar-variant=default]_&]:border [html[data-sidebar-variant=default]_&]:rounded-xl [html[data-sidebar-variant=default]_&]:shadow-sm",
          )}
        >
          {/* Pages can set data-content-padding="false" to render full-bleed app layouts. */}
          <ScrollArea className="dashboard-main-scroll min-h-0 flex-1">
            <div className="min-h-0 min-w-0 p-4 has-data-[content-padding=false]:p-0 md:p-6 md:has-data-[content-padding=false]:p-0">
              {children}
            </div>
          </ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
