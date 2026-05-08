"use client";

import { Bell, CheckCheck } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/lib/notifications";

export default function NotificationsPage() {
  const { notifications, markAllAsRead } = useNotifications();

  return (
    <ProtectedPage permission="view:notifications" restrictedDescription="Notifications are part of the manager workflow in this demo.">
      <PageHeader title="Notifications" description="Manager-facing operational notices and report reminders.">
        <Button onClick={markAllAsRead}>
          <CheckCheck className="h-4 w-4" />
          Mark all read
        </Button>
      </PageHeader>

      <section className="panel overflow-hidden rounded-lg">
        {notifications.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Bell className="mx-auto h-8 w-8 text-subtle" />
            <p className="mt-3 text-sm font-semibold">No notifications</p>
            <p className="mt-1 text-sm text-subtle">You are all caught up.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 px-5 py-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                <div>
                  <p className="text-sm font-semibold">{notification.title}</p>
                  <p className="mt-1 text-sm text-subtle">{notification.body}</p>
                  <p className="mt-2 text-xs text-subtle/70">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </ProtectedPage>
  );
}

