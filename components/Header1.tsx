import React from "react";
import { Button } from "./ui/button";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { ModeToggle } from "./ModeToggle";



const Header1 = () => {


  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <h2 className="font-bold text-xl md:text-2xl">JobPrepper</h2>
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
         

          <SignedOut>

            <SignInButton>
            <Link href="/onboarding" passHref>
              <Button variant="outline">Sign In</Button>
            </Link>
            </SignInButton>
          
          </SignedOut>
          <Link href = {'/onboarding'}>
          <SignedIn>
          
          <Button variant="outline">Dashboard</Button>

          </SignedIn>
          </Link>

          <ModeToggle/>
        </div>
      </nav>
    </header>
  );
}

export default Header1