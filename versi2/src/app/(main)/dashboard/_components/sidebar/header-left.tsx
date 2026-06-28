"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { SearchDialog } from "./search-dialog";

export function HeaderLeft({ initialShow }: { readonly initialShow: boolean }) {
  const showSidebarTrigger = usePreferencesStore((s) => (s.isSynced ? s.showSidebarTrigger : initialShow));

  return (
    <div className="flex items-center gap-1 lg:gap-2">
      {showSidebarTrigger && (
        <>
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
          />
        </>
      )}
      <SearchDialog />
    </div>
  );
}
