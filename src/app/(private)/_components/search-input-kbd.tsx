"use client";

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function SearchInputKbd(props: React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <Input {...props} type="text" className="ps-9 pe-12" {...props} />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3">
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  );
}
