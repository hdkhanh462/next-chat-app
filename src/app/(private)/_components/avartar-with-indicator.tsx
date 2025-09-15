import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/shadcn";
import { UserIcon } from "lucide-react";

type Props = {
  alt: string | null;
  image: string | null;
  className?: string;
  fallbackClassName?: string;
  online?: boolean;
  notifications?: number;
};

export default function AvartarWithIndicator({
  image,
  alt,
  className,
  fallbackClassName,
  online,
  notifications,
}: Props) {
  return (
    <div className="relative">
      <Avatar className={className}>
        <AvatarImage src={image || ""} alt={alt || "Avatar"} />
        <AvatarFallback>
          <UserIcon className={cn("size-4", fallbackClassName)} />
        </AvatarFallback>
      </Avatar>
      {notifications && notifications > 0 && (
        <Badge
          variant="destructive"
          className="border-background rounded-full absolute -top-1.5 right-full min-w-5 translate-x-3.5 px-1"
        >
          {notifications}
        </Badge>
      )}

      {online !== undefined ? (
        online ? (
          <span className="border-sidebar absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500">
            <span className="sr-only">Online</span>
          </span>
        ) : (
          <span className="border-sidebar absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-muted-foreground">
            <span className="sr-only">Offline</span>
          </span>
        )
      ) : null}
    </div>
  );
}
