'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const ThemeSwitch = () =>{
    const { setTheme } = useTheme();
    return (
   <DropdownMenu>
	 <DropdownMenuTrigger asChild>
        <Button type='button' variant='ghost' className='cursor-pointer'>
           <IoSunnyOutline className='dark:hidden'/>
           <IoMoonOutline className='hidden dark:block'/>
        </Button>
     </DropdownMenuTrigger>
	 <DropdownMenuContent>
	   <DropdownMenuItem onClick={() => {console.log('light');setTheme('light')}}>Light</DropdownMenuItem>
	   <DropdownMenuItem onClick={() => {console.log('dark');setTheme('dark')}}>Dark</DropdownMenuItem>
	   <DropdownMenuItem onClick={() => {console.log('system');setTheme('system')}}>System</DropdownMenuItem>
	 </DropdownMenuContent>
   </DropdownMenu>
    );
};

export default ThemeSwitch;
