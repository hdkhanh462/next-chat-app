"use client";

import { CircleXIcon, SearchIcon } from "lucide-react";
import { useRef } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/utils/shadcn";

type Props = React.ComponentProps<"input"> & {
  wraperClassName?: string;
  startIcon?: React.ReactNode;
};

export default function SearchInput({
  value,
  className,
  wraperClassName,
  startIcon,
  onChange,
  ...props
}: Props) {
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
    <div className={cn("relative w-full", wraperClassName)}>
      <Input
        {...props}
        className={cn("ps-9 pe-9", className)}
        type="text"
        ref={inputRef}
        value={value}
        onChange={onChange}
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        {startIcon ? startIcon : <SearchIcon size={16} />}
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
