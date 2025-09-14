import React from "react";

type Props = {
  online?: boolean;
};

export default function OnlineIndicator({ online }: Props) {
  if (online)
    return (
      <div className="size-3 rounded-full border-2 bg-emerald-500 border-background">
        <span className="sr-only">Online</span>
      </div>
    );

  return (
    <div className="size-3 rounded-full border-2 bg-muted-foreground border-background">
      <span className="sr-only">Offline</span>
    </div>
  );
}
