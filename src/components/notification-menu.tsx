"use client";

import { useState } from "react";
import { BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/shadcn";
import Link from "next/link";
import { useUser } from "@/data/user";

const initialNotifications = [
  {
    id: 1,
    user: "Chris Tompson",
    action: "requested review on",
    target: "PR #42: Feature implementation",
    timestamp: "15 minutes ago",
    unread: true,
  },
  {
    id: 2,
    user: "Emma Davis",
    action: "shared",
    target: "New component library",
    timestamp: "45 minutes ago",
    unread: true,
  },
  {
    id: 3,
    user: "James Wilson",
    action: "assigned you to",
    target: "API integration task",
    timestamp: "4 hours ago",
    unread: false,
  },
  {
    id: 4,
    user: "Alex Morgan",
    action: "replied to your comment in",
    target: "Authentication flow",
    timestamp: "12 hours ago",
    unread: false,
  },
  {
    id: 5,
    user: "Sarah Chen",
    action: "commented on",
    target: "Dashboard redesign",
    timestamp: "2 days ago",
    unread: false,
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationMenu() {
  const { data: user, isLoading } = useUser();
  const [notifications, setNotifications] = useState(initialNotifications);

  if (isLoading)
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-muted-foreground"
      >
        <BellIcon size={16} aria-hidden="true" />
      </Button>
    );

  if (!user) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative rounded-full text-muted-foreground"
          aria-label="Open notifications"
        >
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <div
              aria-hidden="true"
              className="bg-destructive absolute top-0.5 right-0.5 size-2 rounded-full"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-80" align="end">
        <div className="flex items-baseline justify-between gap-4 p-2">
          <div className="text-sm font-semibold">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="text-xs font-medium hover:underline"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="h-px my-1 -mx-1 bg-border"
        />
        <div className="space-y-1">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors",
                notification.unread && "bg-accent"
              )}
            >
              <div className="relative flex items-start pe-3">
                <div className="flex-1 space-y-1">
                  <button
                    className="text-left text-foreground/80 after:absolute after:inset-0"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <span className="font-medium text-foreground hover:underline">
                      {notification.user}
                    </span>{" "}
                    {notification.action}{" "}
                    <span className="font-medium text-foreground hover:underline">
                      {notification.target}
                    </span>
                    .
                  </button>
                  <div className="text-xs text-muted-foreground">
                    {notification.timestamp}
                  </div>
                </div>
                {notification.unread && (
                  <div className="absolute self-center end-0">
                    <span className="sr-only">Unread</span>
                    <Dot className="text-destructive size-2" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="h-px my-1 -mx-1 bg-border"
        />
        <Link href={"/notifications"} className="text-xs font-medium">
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full hover:underline"
          >
            View all notifications
          </Button>
        </Link>
      </PopoverContent>
    </Popover>
  );
}
