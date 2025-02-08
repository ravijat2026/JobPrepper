"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PenBox,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { SignedIn, SignOutButton } from "@clerk/nextjs";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Industry Insights",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Build Resume",
      icon: FileText,
      path: "/dashboard/resume",
    },
    {
      name: "Cover Letter",
      icon: PenBox,
      path: "/dashboard/ai-cover-letter",
    },
    {
      name: "Interview Prep",
      icon: GraduationCap,
      path: "/dashboard/interview",
    },
  ];

  return (
    <>
      <div
        className={`h-screen w-64 fixed top-16 left-0 p-6 z-50 flex flex-col space-y-4 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}
      >
        <div className="mt-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link href={item.path} key={item.name} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Button
                variant={pathname === item.path ? "default" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>

        <div className="pt-[360px] p-6">
          <SignedIn>
            <SignOutButton>
              <Button variant="outline" className="dark:text-white">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
