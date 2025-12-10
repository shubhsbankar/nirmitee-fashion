import { WEBSITE_HOME } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import logo from '@/public/assets/images/dark-logo.png'
import Link from 'next/link';
import { IoIosSearch } from 'react-icons/io';
import { BsCart2 } from 'react-icons/bs';



const Header = () => {
    return (
        <div className='bg-white border-b lg:px-32 px-4'>
            <div className='flex justify-between items-center lg:py-5 py-3'>
                <Link href={WEBSITE_HOME}>
                    <Image src={logo} width={383} height={146} alt='Nirmitee Fashion Logo' className='lg:w-28 w-24' />
                </Link>
                <div className='flex justify-between gap-20'>
                    <nav>
                        <ul className='flex justify-between items-center gap-10 px-3'>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                                <Link href={WEBSITE_HOME} className='block py-2'>Home</Link>
                            </li>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                                <Link href='' className='block py-2'>About</Link>
                            </li>
                                <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                                <Link href='' className='block py-2'>Shop</Link>
                            </li>
                                          <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                                <Link href='' className='block py-2'>Imitation Jwellary</Link>
                            </li>
                                                                   <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                                <Link href='' className='block py-2'>Cosmetics</Link>
                            </li>
                        </ul>
                    </nav>

                    <div className='flex justify-between items-center gap-8'>
                        <button type='button'>
                            <IoIosSearch className='text-gray-500 hover:text-primary cursor-pointer'/>
                            </button>
                            
                    </div>

                </div>
            </div>


        </div>
    )
}

export default Header