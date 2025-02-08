'use client'
import React, { useState } from "react";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

import { ModeToggle } from "./ModeToggle";
import Sidebar from "./Sidebar";
import { MenuIcon } from "lucide-react";

const Navbar = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <h2 className="font-bold text-xl md:text-2xl">JobPrepper</h2>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <MenuIcon
            className="md:hidden block cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <ModeToggle />
          <div className="">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </div>
        </div>
      </nav>
    </header>
  );

}

export default Navbar