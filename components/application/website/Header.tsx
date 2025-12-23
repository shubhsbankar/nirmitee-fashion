'use client'
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/assets/images/dark-logo.png'
import { IoIosSearch, IoMdClose } from 'react-icons/io'
import Cart from './Cart'
import { VscAccount } from "react-icons/vsc";
import { useSelector } from 'react-redux'
import { Avatar } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar';
import userImage from '@/public/assets/images/user.png';
import { HiMiniBars3 } from 'react-icons/hi2';
import { useState } from 'react'
import Search from './Search'



const Header = () => {
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const auth = useSelector(store => store.authStore.auth);
  console.log('Header auth: ', auth);
  return (
    <div className='bg-white border-b lg:px-32 px-4'>
      <div className='flex items-center justify-between lg:py-2 py-3'>
        <Link href={WEBSITE_HOME}>
        <Image src={logo} alt='Nirmitee Fashion Logo' width={250} height={120}  className='lg:w-32 w-24'/>
        </Link>
        <div className='flex justify-between gap-20'>
          <nav className={`lg:relative lg:w-auto lg:top-0 lg:left-0 bg-white  fixed z-50 top-0 w-full lg:h-auto h-screen transition-all ${isMobileMenu ? 'left-0' : 'left-[-100%]'}`}>
            <div className='lg:hidden flex justify-between items-center bg-gray50 py-3 border-b px-3'>
               <Image src={logo} alt='Nirmitee Fashion Logo' width={250} height={120}  className='lg:w-32 w-24'/>
                <button type='button'>
                <IoMdClose size={25} className='text-gray-500 hover:text-primary'onClick={() => setIsMobileMenu(false)}/>
              </button>

            </div>
            
            <ul className='lg:flex justify-between gap-10 items-center px-3'>
                <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                    <Link href={WEBSITE_HOME} className='block py-2'>Home</Link>
                </li>
                <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                    <Link href='' className='block py-2'>About</Link>
                </li>
                <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                    <Link href={WEBSITE_SHOP} className='block py-2'>Shop</Link>
                </li>
                <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                    <Link href='' className='block py-2'>Imetation Jwellary</Link>
                </li>
                <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                    <Link href='' className='block py-2'>Cosmetics</Link>
                </li>
            </ul>
          </nav>
          <div className='flex justify-between items-center gap-8'>
            <button type='button' onClick={() => setShowSearch(!showSearch)}>
           <IoIosSearch
           className='text-gray-500 hover:text-primary cursor-pointer'
           size={25}
           />
         </button>
         <Cart />
         {
            !auth ?(
         <Link href={WEBSITE_LOGIN}>
            <VscAccount className='text-gray-500 hover:text-primary cursor-pointer'
           size={25}/>
         </Link>):
         (
         <Link href={USER_DASHBOARD}>
           <Avatar>
            <AvatarImage src={auth?.avatar?.url || userImage.src}/>
           </Avatar>
         </Link>)

         }
        
              <button type='button' className='lg:hidden block' onClick={() => setIsMobileMenu(true)}>
                <HiMiniBars3 size={25} className='text-gray-500 hover:text-primary'/>
              </button>

          </div>
        </div>
      </div>
      <Search isShow={showSearch} />
    </div>
  )
}

export default Header
