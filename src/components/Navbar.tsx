"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

import Link from "next/link";
import { useState } from "react";

interface NavbarDemoProps {
  children?: React.ReactNode;
}

export function NavbarDemo({ children }: NavbarDemoProps) {
  const navItems = [
    {
      name: "Features",
      link: "/features",
    },
    {
      name: "Pricing",
      link: "/pricing",
    }
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const {isSignedIn} = useUser();

  return (
    <div className="relative w-full bg-inherit ">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            { !isSignedIn &&  <SignInButton mode="modal"   >
              <NavbarButton className="bg-gradient-to-r from-purple-500 to-orange-500">     
                    Login   
                    </NavbarButton>
                    </SignInButton> }
            { isSignedIn && <UserButton /> }
         
          {isSignedIn &&   <Link href={'/dashboard'} ><NavbarButton className="bg-gradient-to-r from-purple-500 to-orange-500" >Dashboard</NavbarButton></Link>}

          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              { !isSignedIn &&  <SignInButton mode="modal"   >
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-orange-500"
              >
                Login
              </NavbarButton>
              </SignInButton> }
              { isSignedIn && <UserButton /> }
              {isSignedIn &&   <Link href={'/dashboard'} ><NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-orange-500"
              >Dashboard</NavbarButton></Link>}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      

      {/* Navbar */}
      {children}
    </div>
  );
}


