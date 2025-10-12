"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <Link href="/dashboard" className="md:hidden">
          <h1 className="text-lg font-bold text-gray-900">AI Dashboards</h1>
        </Link>
      </div>
      <UserNav />
    </div>
  );
}
