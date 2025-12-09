'use client'
import ThemeSwitch from './ThemeSwitch';
import UserDropdown from './UserDropdown';
import { RiMenu4Fill } from "react-icons/ri";
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import Search from './Search';
import Image from 'next/image';
import logoBlack from '@/public/assets/images/NFLogo.png';
import logoWhite from '@/public/assets/images/logo-white.png';
import MobileSearch from './MobileSearch';

const Topbar = () =>{
    const {toggleSidebar} = useSidebar();
    return (
       <div className='fixed border h-14 w-full top-0 left-0 z-30 md:ps-72 md:pe-8 px-5 flex justify-between 
          items-center bg-white dark:bg-card'>
            <div className='flex items-center md:hidden'>
             <Image  width={logoBlack.width} src={logoBlack.src} height={50} className="block dark:hidden h-[50px] w-auto" alt="logo dark"/>
             <Image  width={logoWhite.width} src={logoWhite.src} height={50} className="hidden dark:block h-[50px] w-auto" alt="logo white"/>
            </div>
          <div className='md:block hidden'>
             <Search />
          </div>

          <div className='flex items-center gap-2'>
            <MobileSearch/>
             <ThemeSwitch />
             <UserDropdown/>
             <Button onClick={toggleSidebar} className='ms-2 md:hidden' type='button' size='icon'>
                <RiMenu4Fill />
             </Button>

          </div>
   </div>
    );
};

export default Topbar;
