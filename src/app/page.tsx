"use client";

import HeroSection from "@/components/Home/HeroSection";
import { NavbarDemo } from "@/components/Navbar";


export default function Home() {


  return (
    <div className="relative w-full h-full bg-gradient-to-b from-black to-[#0C0C1C] text-primary">
  
       
    <NavbarDemo>
        <HeroSection />  
    </NavbarDemo>


    </div>
  );
}


