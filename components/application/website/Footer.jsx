import Image from 'next/image';
import logo from '@/public/assets/images/nf_logo.png'
import Link from 'next/link';
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER, WEBSITE_SHOP } from '@/routes/WebsiteRoute';
import { IoLocationOutline } from 'react-icons/io5';
import { MdOutlineEmail, MdOutlinePhone } from 'react-icons/md';
import { AiOutlineYoutube } from 'react-icons/ai';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { TiSocialFacebookCircular } from 'react-icons/ti';
import { FaXTwitter } from "react-icons/fa6";


const Footer = () => {
  return (
    <footer className='bg-gray-50 border-t pt-5'>
      <div className='grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10py-10 lg:px-32 px-4 mt-3'>
        <div className='lg:col-span-1 md:col-span-2 col-span-1'>
          <Image src={logo} alt='Nirmitee Fashion Logo' width={250} height={120} className=' w-36 mb-2' />
          <p className='text-gray-500 text-sm mt-2 mb-5'>
            Nirmitee Fashion is your trusted online destination for the latest trends in Imetation Jewelry and Cosmetics, offering a curated selection of high-quality products to enhance your style and beauty.
          </p>
        </div>

        <div>
          <h4 className='text-xl font-bold uppercase mb-5'>Categories</h4>
          <ul>
            <li className='mb-2 text-gray-500'>
              <Link href={`${WEBSITE_SHOP}?category=imitation-jewellery`}>Imetation Jwelary</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={`${WEBSITE_SHOP}?category=cosmetics`}>Cosmetics</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className='text-xl font-bold uppercase mb-5'>Usefull Links</h4>
          <ul>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_HOME}>Home</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_SHOP}>Shop</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href='/about-us'>About</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_REGISTER}>Register</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className='text-xl font-bold uppercase mb-5'>Help Center</h4>
          <ul>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_REGISTER}>Register</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={USER_DASHBOARD}>My Account</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href='/privacy-policy'>Privacy Policy</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href='/terms-and-conditions'>Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className='text-xl font-bold uppercase mb-5'>Contact Us</h4>
          <ul>
            <li className='mb-2 text-gray-500 flex gap-2'>
              <IoLocationOutline size={20} />
              <span className='text-sm'>Nirmitee Fashion Yavatmal, India 445001</span>
            </li>
            <li className='mb-2 text-gray-500 flex gap-2 text-sm'>
              <MdOutlinePhone size={20} />
              <Link href='tel:+91-8592654363' className='hover:text-primary'>+91-8592654363</Link>
            </li>
            <li className='mb-2 text-gray-500 flex gap-2 text-sm'>
              <MdOutlineEmail size={20} />
              <Link href='mailto:support@nirmitee-fashion.com' className='hover:text-primary'>support@nirmitee-fashion.com</Link>
            </li>
          </ul>
          <div className='flex gap-5 mt-5'>
            <Link href=''><AiOutlineYoutube className='text-primary' size={25} /></Link>
            <Link href=''><FaInstagram className='text-primary' size={25} /></Link>
            <Link href=''><FaWhatsapp className='text-primary' size={25} /></Link>
            <Link href=''><TiSocialFacebookCircular className='text-primary' size={25} /></Link>
            <Link href=''><FaXTwitter className='text-primary' size={25} /></Link>
          </div>
        </div>
      </div>

      <div className='py-5 bg-gray-100'>
        <p className='text-center'>© {new Date().getFullYear()} Nirmitee Fashion. All rights reserved.</p>

      </div>

    </footer>
  )
}

export default Footer
