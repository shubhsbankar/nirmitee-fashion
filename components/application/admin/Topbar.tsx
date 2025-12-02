'use client'
import ThemeSwitch from './ThemeSwitch';
import UserDropdown from './UserDropdown';
import { RiMenu4Fill } from "react-icons/ri";
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

const Topbar = () =>{
    const {toggleSidebar} = useSidebar();
    return (
       <div className='fixed border h-14 w-full top-0 left-0 z-30 md:ps-72 md:pe-8 px-5 flex justify-between 
          items-center bg-white dark:bg-card'>
          <div>
             Serach component
          </div>

          <div className='flex items-center gap-2'>
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
