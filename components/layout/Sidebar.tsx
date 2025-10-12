"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Upload, 
  Settings,
  Database,
  CreditCard
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Datasets",
    icon: Database,
    href: "/dashboard/datasets",
    color: "text-green-500",
  },
  {
    label: "Upload Data",
    icon: Upload,
    href: "/dashboard/upload",
    color: "text-violet-500",
  },
  {
    label: "Upgrade",
    icon: CreditCard,
    href: "/pricing",
    color: "text-yellow-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-700",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Exact match for dashboard home
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    // For other routes, check if pathname starts with the route
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-black border-r border-gray-800 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14 group">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:from-green-500 group-hover:to-green-400 transition-all">
            NexSight
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                isActive(route.href)
                  ? "text-white bg-white/10"
                  : "text-gray-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
