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
    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-800 bg-black/50 backdrop-blur-lg sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-400 hover:text-white"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <Link href="/dashboard" className="md:hidden">
          <h1 className="text-lg font-bold text-white">Glimtrics</h1>
        </Link>
      </div>
      <UserNav />
    </div>
  );
}
