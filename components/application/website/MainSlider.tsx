'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import slider1 from '@/public/assets/images/Desktop_from_Sanya.webp'
import slider2 from '@/public/assets/images/slider2.webp'
import slider3 from '@/public/assets/images/slider3.webp'
import slider4 from '@/public/assets/images/Desktop_from_Priyanka_1.webp'
import Image from 'next/image';
import { LuChevronRight, LuChevronLeft } from 'react-icons/lu';

const ArrowNext = (props) => {
  const { onClick } = props;

  return (
    <button type='button' onClick={ onClick} className='w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2
    bg-white right-10' >
      <LuChevronRight size={25} className='text-gray-600'/>

    </button>
  )
  
}

const ArrowPrevious = (props) => {
  const { onClick } = props;

  return (
    <button type='button' onClick={ onClick} className='w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2
    bg-white left-10' >
      <LuChevronLeft size={25} className='text-gray-600'/>

    </button>
  )
  
}


const MainSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    nextArrow: <ArrowNext />,
    prevArrow: <ArrowPrevious />,
    arrows: true,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          dots: false,
          arrows: false,
        }
       }
     ]
  }
  return (
    <div>
      <Slider {...settings}>
        <div>
          <Image src={slider1.src} width={slider1.width} height={slider1.height} alt='slider1' className='w-full h-full' />
        </div>
        <div>
          <Image src={slider2.src} width={slider2.width} height={slider2.height} alt='slider2' className='w-full h-full'/>
        </div>
        <div>
          <Image src={slider3.src} width={slider3.width} height={slider3.height} alt='slider3' className='w-full h-full'/>
        </div>
        <div>
          <Image src={slider4.src} width={slider4.width} height={slider4.height} alt='slider4' className='w-full h-full'/>
        </div>
      </Slider>
    </div>
  )
}

export default MainSlider
