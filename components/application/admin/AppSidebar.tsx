import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from 'next/image';
import logoBlack from '@/public/assets/images/logo-black.png';
import logoWhite from '@/public/assets/images/logo-white.png';
import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from '@/lib/adminSidebarMenu';
import Link from 'next/link';

const AppSidebar = () =>{
    return (
         <Sidebar>
      <SidebarHeader className='border-b h-14 p-0'>
         <div className='flex justify-between items-center px-4'>
             <Image  width={logoBlack.width} src={logoBlack.src} height={50} className="block dark:hidden h-[50px] w-auto" alt="logo dark"/>
             <Image  width={logoWhite.width} src={logoWhite.src} height={50} className="hidden dark:block h-[50px] w-auto" alt="logo white"/>
             <Button type='button' size='icon' className='md:hidden'> 
                <IoMdClose />
            </Button>
         </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          { 
            adminAppSidebarMenu.map((menu, index) => (
              <Collapsible key={index} className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild>
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
