import React from "react";
import { Button } from "./ui/button";

import Link from "next/link";
import {SignedIn, SignedOut, SignInButton} from "@clerk/nextjs";

import { ModeToggle } from "./ModeToggle";



const Header1 = () => {


  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <h2 className="font-bold text-xl md:text-2xl">JobPrepper</h2>
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
         

        <SignedIn>
            <Link href="/onboarding">
              <Button variant="outline">
                Dashboard
              </Button>
            </Link>
        </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <ModeToggle/>
        </div>
      </nav>
    </header>
  );
}

export default Header1