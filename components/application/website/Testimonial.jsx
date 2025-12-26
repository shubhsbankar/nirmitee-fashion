'use client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoStar } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";



export const testimonials = [
    {
        name: "Anjali Deshmukh",
        review: `I ordered both cosmetics and imitation jewellery, and the quality exceeded my expectations.
The makeup feels premium on the skin and lasts long without irritation.
The jewellery looks elegant and perfect for daily as well as festive wear.`,
        ratings: 5,
    },
    {
        name: "Pooja Kulkarni",
        review: `The cosmetic products are very smooth and give a natural finish.
I was surprised by how lightweight the imitation jewellery feels.
Overall, a very satisfying shopping experience.`,
        ratings: 4.5,
    },
    {
        name: "Sneha Patil",
        review: `I bought a lipstick set along with earrings, and both were beautifully packed.
The colors are exactly as shown, and the jewellery has a classy shine.
Definitely recommending this to my friends.`,
        ratings: 5,
    },
    {
        name: "Ritika Sharma",
        review: `The cosmetics are perfect for daily use and do not harm the skin.
Imitation jewellery designs are modern and match well with Indian outfits.
Delivery was quick and hassle-free.`,
        ratings: 4,
    },
    {
        name: "Neha Joshi",
        review: `I loved the quality of the makeup products, especially the compact and lipstick.
The jewellery looks premium and does not feel cheap at all.
Great value for money and excellent finishing.`,
        ratings: 4.5,
    },
    {
        name: "Kavita More",
        review: `Cosmetics are skin-friendly and suitable even for sensitive skin.
The imitation jewellery collection is trendy and eye-catching.
I am very happy with my purchase overall.`,
        ratings: 5,
    },
    {
        name: "Rashmi Kulkarni",
        review: `The foundation blends very well and gives a smooth look.
Jewellery pieces are stylish and perfect for functions and parties.
Customer support was also responsive and helpful.`,
        ratings: 4,
    },
    {
        name: "Priya Bansal",
        review: `I was impressed with the packaging and product quality.
Cosmetics are long-lasting, and jewellery designs are unique.
This brand has become my go-to choice now.`,
        ratings: 5,
    },
    {
        name: "Sonali Chavan",
        review: `The cosmetic range is affordable yet feels premium.
Imitation jewellery matches perfectly with both western and traditional outfits.
Very satisfied with the overall experience.`,
        ratings: 4.5,
    },
    {
        name: "Megha Verma",
        review: `The makeup products are easy to apply and give a flawless finish.
Jewellery quality is excellent and looks just like real ornaments.
I will definitely shop again from here.`,
        ratings: 5,
    },
];


const Testimonial = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: true,
                    infinite: true,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                }
            }
        ]
    }
    return (
        <div className='lg:px-32 px-4 sm:pt-20 pt-5 pb-10'>
            <h2 className="text-center sm:text-4xl text-2xl mb-5 font-semibold">Customer Review</h2>
            <Slider {...settings}>
                {
                    testimonials.map((item, index) => (
                        <div key={index} className="p-5">
                            <div className="rounded-lg p-5 border h-auto">
                                <BsChatQuote size={30} className="mb-3"/>
                                <p className="pb-5 line-clamp-2">{item.review}</p>
                                <h4 className="font-semibold">{item.name}</h4>
                                <div className="flex mt-1">
                                    {
                                        Array.from({ length: item.ratings }).map((_, i) => (
                                            <IoStar key={`start${i}`} className="text-yellow-400" size={20} />
                                        ))
                                    }

                                </div>
                            </div>

                        </div>
                    ))
                }
            </Slider>
        </div>
    )
}

export default Testimonial
