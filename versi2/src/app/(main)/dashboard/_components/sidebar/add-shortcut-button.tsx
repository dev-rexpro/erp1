"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function AddShortcutButton() {
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => toast.info("Shortcut management coming soon!")}
      title="Add Shortcut"
    >
      <Plus className="size-4" />
    </Button>
  );
}
