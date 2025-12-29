'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from 'next/image';
import logoBlack from '@/public/assets/images/nf_logo.png"';
import logoWhite from '@/public/assets/images/logo-white.png';
import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from '@/lib/adminSidebarMenu';
import Link from 'next/link';
//import logoBlack from '@/public/assets/images/dark-logo.png';
//import logoWhite from '@/public/assets/images/light-logo.png';

const AppSidebar = () =>{
    const {toggleSidebar} = useSidebar();
    return (
         <Sidebar className='z-50'>
      <SidebarHeader className='border-b h-14 p-0'>
         <div className='flex justify-between items-center px-4'>
             <Image  width={logoBlack.width} src={logoBlack.src} height={50} className="block dark:hidden h-[50px] w-auto" alt="logo dark"/>
             <Image  width={logoWhite.width} src={logoWhite.src} height={50} className="hidden dark:block h-[50px] w-auto" alt="logo white"/>
             <Button onClick={toggleSidebar} type='button' size='icon' className='md:hidden'> 
                <IoMdClose />
            </Button>
         </div>
      </SidebarHeader>
      <SidebarContent className='p-3'>
        <SidebarMenu>
          { 
            adminAppSidebarMenu.map((menu, index) => (
              <Collapsible key={index} className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild className='font-semibold px-2 py-5'>
                      <Link href={menu?.url} >
                        <menu.icon />
                        {menu.title}
                        {menu.subMenu && menu.subMenu.length > 0 &&
                          <LuChevronRight className="ml-auto transition-transform duration-200 
                            group-data-[state=open]/collapsible:rorate-90"/>
                        }
                      </Link>
                    </SidebarMenuButton>

                  </CollapsibleTrigger>
                  {menu.subMenu && menu.subMenu.length > 0 &&
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        { menu.subMenu.map((submenu,index)=> (
                        <SidebarMenuSubItem key={index}>
                          <SidebarMenuSubButton asChild className='px-2 py-5'>
                            <Link href={submenu.url}>
                            {submenu.title}
                            </Link>
                          </SidebarMenuSubButton>
                     
                        </SidebarMenuSubItem>
                        ))
                        
                        }
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  }
                  </SidebarMenuItem>
              </Collapsible>
            ))
          }
        </SidebarMenu>
      </SidebarContent>  
    </Sidebar>
    );
};

export default AppSidebar;
