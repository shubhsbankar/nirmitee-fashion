// 'use client'
// import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
// import Image from 'next/image'
// import Link from 'next/link'
// import logo from '@/public/assets/images/nf_logo.png'
// import { IoIosSearch, IoMdClose } from 'react-icons/io'
// import Cart from './Cart'
// import { VscAccount } from "react-icons/vsc";
// import { useSelector } from 'react-redux'
// import { Avatar } from '@/components/ui/avatar'
// import { AvatarImage } from '@radix-ui/react-avatar';
// import userImage from '@/public/assets/images/user.png';
// import { HiMiniBars3 } from 'react-icons/hi2';
// import { useState } from 'react'
// import Search from './Search'
// import WebsiteContextMenu from './WebsiteContextMenu'



// const Header = () => {
//   const [isMobileMenu, setIsMobileMenu] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const auth = useSelector(store => store.authStore.auth);

//   return (
//     <div className='bg-white border-b lg:px-32 px-4'>
//       <div className='flex items-center justify-between lg:py-2 py-3'>
//         <Link href={WEBSITE_HOME}>
//         <Image src={logo} alt='Nirmitee Fashion Logo' width={250} height={120}  className='lg:w-32 w-24'/>
//         </Link>
//         <div className='flex justify-between gap-20'>
//           <nav className={`lg:relative lg:w-auto lg:top-0 lg:left-0 bg-white  fixed z-50 top-0 w-full lg:h-auto h-screen transition-all ${isMobileMenu ? 'left-0' : 'left-[-100%]'}`}>
//             <div className='lg:hidden flex justify-between items-center bg-gray50 py-3 border-b px-3'>
//                <Image src={logo} alt='Nirmitee Fashion Logo' width={250} height={120}  className='lg:w-32 w-24'/>
//                 <button type='button'>
//                 <IoMdClose size={25} className='text-gray-500 hover:text-primary'onClick={() => setIsMobileMenu(false)}/>
//               </button>

//             </div>

//             <ul className='lg:flex justify-between gap-10 items-center px-3'>
//                 <li className='text-gray-600 hover:text-primary hover:font-semibold'>
//                     <Link href={WEBSITE_HOME} className='block py-2'>Home</Link>
//                 </li>
//                 <li className='text-gray-600 hover:text-primary hover:font-semibold'>
//                     <Link href='/about-us' className='block py-2'>About</Link>
//                 </li>
//                 <li className='text-gray-600 hover:text-primary hover:font-semibold'>
//                     <Link href={WEBSITE_SHOP} className='block py-2'>Shop</Link>
//                 </li>
//                 <li className='text-gray-600 hover:text-primary hover:font-semibold'>
//                     <Link href={`${WEBSITE_SHOP}?category=imitation-jewellery`} className='block py-2' onClick={() => <WebsiteContextMenu />}>Imetation Jwellary</Link>
//                 </li>
//                 <li className='text-gray-600 hover:text-primary hover:font-semibold'>
//                     <Link href={`${WEBSITE_SHOP}?category=cosmetics`} className='block py-2'>Cosmetics</Link>
//                 </li>
//             </ul>
//           </nav>
//           <div className='flex justify-between items-center gap-8'>
//             <button type='button' onClick={() => setShowSearch(!showSearch)}>
//            <IoIosSearch
//            className='text-gray-500 hover:text-primary cursor-pointer'
//            size={25}
//            />
//          </button>
//          <Cart />
//          {
//             !auth ?(
//          <Link href={WEBSITE_LOGIN}>
//             <VscAccount className='text-gray-500 hover:text-primary cursor-pointer'
//            size={25}/>
//          </Link>):
//          (
//          <Link href={USER_DASHBOARD}>
//            <Avatar>
//             <AvatarImage src={auth?.avatar?.url || userImage.src}/>
//            </Avatar>
//          </Link>)

//          }

//               <button type='button' className='lg:hidden block' onClick={() => setIsMobileMenu(true)}>
//                 <HiMiniBars3 size={25} className='text-gray-500 hover:text-primary'/>
//               </button>

//           </div>
//         </div>
//       </div>
//       <Search isShow={showSearch} />
//     </div>
//   )
// }

// export default Header

'use client'

import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/assets/images/nf_logo.png'
import { IoIosSearch, IoMdClose } from 'react-icons/io'
import Cart from './Cart'
import { VscAccount } from "react-icons/vsc";
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import userImage from '@/public/assets/images/user.png';
import { HiMiniBars3 } from 'react-icons/hi2';
import { useEffect, useState } from 'react'
import Search from './Search'
import HoverMenu from './HoverMenu'
import useFetch from '@/hooks/useFetch'
import axios from 'axios'

const Header = () => {
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [category, setCategory] = useState('');

  const auth = useSelector(state => state?.authStore?.auth);
  const { data: allCategories } = useFetch(
    "/api/category?deleteType=SD&size=10000&isCategory=true"
  );

  console.log('allCategories', allCategories)

  // useEffect(() => {
  //   const fetchSubCategories = async () => {
  //     const { data: allCategories } = await axios.get(
  //       `/api/category/get-subcategories?category=${category}`
  //     );
  //     console.log('allCategories', allCategories);
  //   }
  //   //fetchSubCategories();
  // }, [category])

  return (
    <div className='bg-white border-b lg:px-32 px-4'>
      <div className='flex items-center justify-between lg:py-2 py-3'>
        <Link href={WEBSITE_HOME}>
          <Image src={logo} alt='Nirmitee Fashion Logo' width={250} height={120} className='lg:w-32 w-24' />
        </Link>

        <div className='flex justify-between gap-20'>
          <nav className={`lg:relative lg:w-auto lg:top-0 lg:left-0 bg-white fixed z-50 top-0 w-full lg:h-auto h-screen transition-all ${isMobileMenu ? 'left-0' : 'left-[-100%]'}`}>
            <div className='lg:hidden flex justify-between items-center bg-gray50 py-3 border-b px-3'>
              <Image src={logo} alt='Nirmitee Fashion Logo' width={250} height={120} className='lg:w-32 w-24' />
              <button type='button' onClick={() => setIsMobileMenu(false)}>
                <IoMdClose size={25} className='text-gray-500 hover:text-primary' />
              </button>
            </div>

            <ul className='lg:flex justify-between gap-10 items-center px-3'>
              <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                <Link href={WEBSITE_HOME} className='block py-2'>Home</Link>
              </li>

              <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                <Link href='/about-us' className='block py-2'>About</Link>
              </li>

              <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                <Link href={WEBSITE_SHOP} className='block py-2'>Shop</Link>
              </li>

              {allCategories && allCategories.data.length > 0 &&
                allCategories.data.map(cat => (
                  <li className='text-gray-600 hover:text-primary hover:font-semibold' key={cat._id}>
                    <HoverMenu
                      label={cat.name}
                      href={`${WEBSITE_SHOP}?category=${cat.slug}`}
                      setCategory={() => setCategory(cat.slug)}
                      items={
                        cat?.subCategories.map(subCat => ({ label: subCat.name, href: `${WEBSITE_SHOP}?category=${subCat.slug}` }))
                      }
                    />
                  </li>
                ))
              }
            </ul>
          </nav>

          <div className='flex justify-between items-center gap-8'>
            <button type='button' onClick={() => setShowSearch(!showSearch)}>
              <IoIosSearch className='text-gray-500 hover:text-primary cursor-pointer' size={25} />
            </button>

            <Cart />

            {!auth ? (
              <Link href={WEBSITE_LOGIN}>
                <VscAccount className='text-gray-500 hover:text-primary cursor-pointer' size={25} />
              </Link>
            ) : (
              <Link href={USER_DASHBOARD}>
                <Avatar>
                  <AvatarImage src={auth?.avatar?.url || userImage.src} />
                </Avatar>
              </Link>
            )}

            <button type='button' className='lg:hidden block' onClick={() => setIsMobileMenu(true)}>
              <HiMiniBars3 size={25} className='text-gray-500 hover:text-primary' />
            </button>
          </div>
        </div>
      </div>

      <Search isShow={showSearch} />
    </div>
  )
}

export default Header

