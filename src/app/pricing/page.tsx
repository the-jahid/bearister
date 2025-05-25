import { NavbarDemo } from '@/components/Navbar';
import PricingPage from '@/components/pricing';
import React from 'react';

const Page = () => {
  return (
    <div className='bg-gradient-to-b from-[#0C0C1C] to-black' >
        <NavbarDemo>
            <PricingPage />
        </NavbarDemo>
    </div>
  );
}

export default Page;
