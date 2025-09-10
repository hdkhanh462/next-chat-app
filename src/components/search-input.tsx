"use client";

import { CircleXIcon, SearchIcon } from "lucide-react";
import { useRef } from "react";

import { Input } from "@/components/ui/input";

export default function SearchInput({
  value,
  onChange,
  ...props
}: React.ComponentProps<"input">) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearInput = () => {
    onChange?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      <Input
        {...props}
        type="text"
        className="ps-9 pe-9"
        ref={inputRef}
        value={value}
        onChange={onChange}
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
      {value && (
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear input"
          type="button"
          onClick={handleClearInput}
        >
          <CircleXIcon size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
