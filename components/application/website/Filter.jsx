// 'use client'
// import useFetch from '@/hooks/useFetch';
// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from "@/components/ui/accordion"
// import Link from 'next/link';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Slider } from '@/components/ui/slider';
// import { useEffect, useState } from 'react';
// import ButtonLoading from '../ButtonLoading';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { WEBSITE_SHOP } from '@/routes/WebsiteRoute';
// import { Button } from '@/components/ui/button';

// const Filter = () => {
//     const searchParams = useSearchParams();

//     const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 3000 });
//     const [selectedCategory, setSelectedCategory] = useState([]);
//     const [selectedColor, setSelectedColor] = useState([]);
//     const [selectedSize, setSelectedSize] = useState([]);

//     const router = useRouter();

//     const urlParams = new URLSearchParams(searchParams.toString());

//     useEffect(() => {
//         searchParams.get('category') ? setSelectedCategory(searchParams.get('category')?.split(',')) : setSelectedCategory([]);
//         searchParams.get('color') ? setSelectedColor(searchParams.get('color')?.split(',')) : setSelectedColor([]);
//         searchParams.get('size') ? setSelectedSize(searchParams.get('size')?.split(',')) : setSelectedSize([]);
//         //searchParams.get('minPrice') ? setSelectedSize(searchParams.get('size')?.split(',')) : setSelectedSize([]);
//     },[searchParams])

//     //const { data: categoryData } = useFetch('/api/category/get-category');
//     const { data: colorData } = useFetch('/api/product-variant/colors');
//     const { data: sizeData } = useFetch('/api/product-variant/sizes');
//     const { data: categoryData } = useFetch(
//     "/api/category?deleteType=SD&size=10000&isCategory=true"
//   );
//     console.log('categoryData', categoryData);
//     const handlePriceChange = (value) => {
//         console.log('Price change:',value);
//         setPriceFilter({ minPrice: value[0], maxPrice: value[1] })
//     }

//     const handleCategoryFilter = (categorySlug) => {
//         let newSelectedCategory = [...selectedCategory];

//         if (newSelectedCategory.includes(categorySlug)) {
//             newSelectedCategory = newSelectedCategory.filter(cat => cat !== categorySlug);
//         } else {
//             newSelectedCategory.push(categorySlug);
//         }
//         setSelectedCategory(newSelectedCategory);

//         newSelectedCategory.length > 0 ? urlParams.set('category', newSelectedCategory.join(','))
//             : urlParams.delete('category');

//         router.push(`${WEBSITE_SHOP}?${urlParams.toString()}`)
//     }

//     const handleColorFilter = (color) => {
//         let newSelectedColor = [...selectedColor];

//         if (newSelectedColor.includes(color)) {
//             newSelectedColor = newSelectedColor.filter(c => c !== color);
//         } else {
//             newSelectedColor.push(color);
//         }
//         setSelectedColor(newSelectedColor);

//         newSelectedColor.length > 0 ? urlParams.set('color', newSelectedColor.join(','))
//             : urlParams.delete('color');

//         router.push(`${WEBSITE_SHOP}?${urlParams.toString()}`)
//     }

//     const handleSizeFilter = (size) => {
//         let newSelectedSize = [...selectedSize];

//         if (newSelectedSize.includes(size)) {
//             newSelectedSize = newSelectedSize.filter(s => s !== size);
//         } else {
//             newSelectedSize.push(size);
//         }
//         setSelectedSize(newSelectedSize);

//         newSelectedSize.length > 0 ? urlParams.set('size', newSelectedSize.join(','))
//             : urlParams.delete('size');

//         router.push(`${WEBSITE_SHOP}?${urlParams.toString()}`)
//     }

//     const handlePriceFilter = () => {
//         urlParams.set('minPrice', priceFilter.minPrice);
//         urlParams.set('maxPrice', priceFilter.maxPrice);
//         router.push(`${WEBSITE_SHOP}?${urlParams.toString()}`)

//     }

//     return (
//         <div>
//             {
//                 searchParams.size > 0 &&
//                 <Button type='button' variant={'destructive'} className='w-full' asChild>
//                         <Link href={WEBSITE_SHOP}>Clear Filter</Link>
//                 </Button>
//             }
//             <Accordion type="multiple" defaultValue={['1', '2', '3', '4']}>
//                 <AccordionItem value="1">
//                     <AccordionTrigger className='uppercase font-semibold hover:no-underline'>category</AccordionTrigger>
//                     <AccordionContent>
//                         <div className='max-h-48 overflow-auto'>
//                             <ul>
//                                 {
//                                     categoryData && categoryData.success && categoryData.data.map(
//                                         category => (
//                                             <li key={category._id} className='mb-3'>
//                                                 <label className='flex items-center space-x-3 cursor-pointer' >
//                                                     <Checkbox
//                                                         onCheckedChange={() => handleCategoryFilter(category.slug)}
//                                                         checked={selectedCategory.includes(category.slug)}
//                                                     />
//                                                     <span>{category.name}</span>
//                                                 </label>

//                                             </li>
//                                         )
//                                     )
//                                 }
//                             </ul>
//                         </div>
//                     </AccordionContent>
//                 </AccordionItem>

//                 <AccordionItem value="2">
//                     <AccordionTrigger className='uppercase font-semibold hover:no-underline'>color</AccordionTrigger>
//                     <AccordionContent>
//                         <div className='max-h-48 overflow-auto'>
//                             <ul>
//                                 {
//                                     colorData && colorData.success && colorData.data.map(
//                                         (color, index) => (
//                                             <li key={'CL' + index} className='mb-3'>
//                                                 <label className='flex items-center space-x-3 cursor-pointer' >
//                                                     <Checkbox
//                                                         onCheckedChange={() => handleColorFilter(color)}
//                                                         checked={selectedColor.includes(color)}
//                                                     />
//                                                     <span>{color}</span>
//                                                 </label>

//                                             </li>
//                                         )
//                                     )
//                                 }
//                             </ul>
//                         </div>
//                     </AccordionContent>
//                 </AccordionItem>

//                 <AccordionItem value="3">
//                     <AccordionTrigger className='uppercase font-semibold hover:no-underline'>size</AccordionTrigger>
//                     <AccordionContent>
//                         <div className='max-h-48 overflow-auto'>
//                             <ul>
//                                 {
//                                     sizeData && sizeData.success && sizeData.data.map(
//                                         (size, index) => (
//                                             <li key={'SZ' + index} className='mb-3'>
//                                                 <label className='flex items-center space-x-3 cursor-pointer' >
//                                                     <Checkbox
//                                                         onCheckedChange={() => handleSizeFilter(size)}
//                                                         checked={selectedSize.includes(size)}
//                                                     />
//                                                     <span>{size}</span>
//                                                 </label>

//                                             </li>
//                                         )
//                                     )
//                                 }
//                             </ul>
//                         </div>
//                     </AccordionContent>
//                 </AccordionItem>

//                 <AccordionItem value="4">
//                     <AccordionTrigger className='uppercase font-semibold hover:no-underline'>price</AccordionTrigger>
//                     <AccordionContent>
//                         <Slider defaultValue={[priceFilter.minPrice, priceFilter.maxPrice]} max={3000} step={1} onValueChange={handlePriceChange} />
//                         <div className='flex justify-between items-center pt-2'>
//                             <span>{priceFilter.minPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//                             <span>{priceFilter.maxPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//                         </div>
//                         <div className='mt-4'>
//                             <ButtonLoading onClick={ handlePriceFilter} type='button' text='Filter Price' className='rounded-full' />
//                         </div>
//                     </AccordionContent>
//                 </AccordionItem>
//             </Accordion>
//         </div>
//     )
// }

// export default Filter

'use client'

import useFetch from '@/hooks/useFetch'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { ChevronRight } from "lucide-react"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ButtonLoading from '../ButtonLoading'
import { useRouter, useSearchParams } from 'next/navigation'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'

const Filter = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const urlParams = new URLSearchParams(searchParams.toString())

    // ------------------ STATE ------------------
    const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 3000 })
    const [selectedCategory, setSelectedCategory] = useState([])          // parent slugs
    const [selectedSubCategories, setSelectedSubCategories] = useState([]) // leaf slugs
    const [selectedColor, setSelectedColor] = useState([])
    const [selectedSize, setSelectedSize] = useState([])

    // ------------------ DATA ------------------
    const { data: colorData } = useFetch('/api/product-variant/colors')
    const { data: sizeData } = useFetch('/api/product-variant/sizes')
    const { data: categoryData } = useFetch(
        "/api/category?deleteType=SD&size=10000&isCategory=true"
    )

    // ------------------ URL HELPER ------------------
    const updateURL = (slugs) => {
        if (slugs.length > 0) {
            urlParams.set('category', slugs.join(','))
        } else {
            urlParams.delete('category')
        }
        router.push(`${WEBSITE_SHOP}?${urlParams.toString()}`)
    }

    // ------------------ HYDRATE FROM URL ------------------
    useEffect(() => {
        const colorParam = searchParams.get('color')
        const sizeParam = searchParams.get('size')
        const minPriceParam = searchParams.get('minPrice')
        const maxPriceParam = searchParams.get('maxPrice')

        // restore colors
        if (colorParam) {
            setSelectedColor(colorParam.split(','))
        } else {
            setSelectedColor([])
        }

        // restore sizes
        if (sizeParam) {
            setSelectedSize(sizeParam.split(','))
        } else {
            setSelectedSize([])
        }

        // restore price
        if (minPriceParam && maxPriceParam) {
            setPriceFilter({
                minPrice: Number(minPriceParam),
                maxPrice: Number(maxPriceParam),
            })
        }
    }, [searchParams])


    // ------------------ SYNC FROM URL ------------------
    const categoryParam = searchParams.get('category')

    useEffect(() => {
        if (!categoryParam || !categoryData?.success) {
            setSelectedCategory([])
            setSelectedSubCategories([])
            return
        }

        const selectedSubs = categoryParam.split(',')
        const parents = new Set()

        categoryData.data.forEach(cat => {
            cat.subCategories.forEach(sub => {
                if (selectedSubs.includes(sub.slug)) {
                    parents.add(cat.slug)
                }
            })
        })

        setSelectedSubCategories(selectedSubs)
        setSelectedCategory([...parents])
    }, [categoryParam, categoryData?.success])

    // ------------------ CATEGORY HANDLERS ------------------

    const handleCategoryFilter = (category) => {
        let newSubs = [...selectedSubCategories]
        let newParents = [...selectedCategory]

        const isChecked = newParents.includes(category.slug)
        const subSlugs = category.subCategories.map(s => s.slug)

        if (isChecked) {
            newParents = newParents.filter(c => c !== category.slug)
            newSubs = newSubs.filter(s => !subSlugs.includes(s))
        } else {
            newParents.push(category.slug)
            subSlugs.forEach(slug => {
                if (!newSubs.includes(slug)) newSubs.push(slug)
            })
        }

        setSelectedCategory(newParents)
        setSelectedSubCategories(newSubs)
        updateURL(newSubs)
    }

    const handleSubCategoryFilter = (parent, subSlug) => {
        let newSubs = [...selectedSubCategories]
        let newParents = [...selectedCategory]

        const isChecked = newSubs.includes(subSlug)

        if (isChecked) {
            newSubs = newSubs.filter(s => s !== subSlug)

            const stillChecked = parent.subCategories
                .some(sc => newSubs.includes(sc.slug))

            if (!stillChecked) {
                newParents = newParents.filter(p => p !== parent.slug)
            }
        } else {
            newSubs.push(subSlug)
            if (!newParents.includes(parent.slug)) {
                newParents.push(parent.slug)
            }
        }

        setSelectedSubCategories(newSubs)
        setSelectedCategory(newParents)
        updateURL(newSubs)
    }

    const handleSelectAllSub = (category) => {
        let newSubs = [...selectedSubCategories]
        let newParents = [...selectedCategory]

        category.subCategories.forEach(sc => {
            if (!newSubs.includes(sc.slug)) newSubs.push(sc.slug)
        })

        if (!newParents.includes(category.slug)) {
            newParents.push(category.slug)
        }

        setSelectedSubCategories(newSubs)
        setSelectedCategory(newParents)
        updateURL(newSubs)
    }

    const handleClearAllSub = (category) => {
        let newSubs = selectedSubCategories.filter(
            s => !category.subCategories.some(c => c.slug === s)
        )

        let newParents = selectedCategory.filter(
            c => c !== category.slug
        )

        setSelectedSubCategories(newSubs)
        setSelectedCategory(newParents)
        updateURL(newSubs)
    }

    // ------------------ OTHER FILTERS ------------------

    const handleColorFilter = (color) => {
        let newSelectedColor = [...selectedColor]
        newSelectedColor.includes(color)
            ? newSelectedColor = newSelectedColor.filter(c => c !== color)
            : newSelectedColor.push(color)

        setSelectedColor(newSelectedColor)

        newSelectedColor.length
            ? urlParams.set('color', newSelectedColor.join(','))
            : urlParams.delete('color')

        router.push(`${WEBSITE_SHOP}?${urlParams.toString()}`)
    }

    const handleSizeFilter = (size) => {
        let newSelectedSize = [...selectedSize]
        newSelectedSize.includes(size)
            ? newSelectedSize = newSelectedSize.filter(s => s !== size)
            : newSelectedSize.push(size)

        setSelectedSize(newSelectedSize)

        newSelectedSize.length
            ? urlParams.set('size', newSelectedSize.join(','))
            : urlParams.delete('size')

        router.push(`${WEBSITE_SHOP}?${urlParams.toString()}`)
    }

    const handlePriceChange = (value) => {
        setPriceFilter({ minPrice: value[0], maxPrice: value[1] })
    }

    const handlePriceFilter = () => {
        urlParams.set('minPrice', priceFilter.minPrice)
        urlParams.set('maxPrice', priceFilter.maxPrice)
        router.push(`${WEBSITE_SHOP}?${urlParams.toString()}`)
    }

    // ------------------ UI ------------------
    return (
        <div>
            {searchParams.size > 0 &&
                <Button type='button' variant={'destructive'} className='w-full mb-3' asChild>
                    <Link href={WEBSITE_SHOP}>Clear Filter</Link>
                </Button>
            }

            <Accordion type="multiple" defaultValue={['1', '2', '3', '4']}>

                {/* ---------------- CATEGORY ---------------- */}
                <AccordionItem value="1" className='                            border-b
                            data-[state=open]:border-none
                            data-[state=closed]:border-b'>
                    <AccordionTrigger className='uppercase font-semibold hover:no-underline'>
                        category
                    </AccordionTrigger>

                    <AccordionContent className='pb-0'>
                        <div className='max-h-80 overflow-auto'>
                            <ul className="space-y-4">

                                {categoryData?.success &&
                                    categoryData.data.map(category => {

                                        const isOpen = selectedCategory.includes(category.slug)

                                        return (
                                            <li key={category._id}>

                                                <Collapsible
                                                    defaultOpen={isOpen}
                                                    className="
                            border-b
                            pb-3
                          "
                                                >

                                                    {/* ---------- Parent Row ---------- */}
                                                    <div className="flex items-center justify-between">

                                                        {/* Left side */}
                                                        <label className='flex items-center space-x-3 cursor-pointer font-medium'>
                                                            <Checkbox
                                                                checked={selectedCategory.includes(category.slug)}
                                                                onCheckedChange={() => handleCategoryFilter(category)}
                                                            />
                                                            <span>{category.name}</span>
                                                        </label>

                                                        {/* Right side — Collapsible trigger */}
                                                        <CollapsibleTrigger asChild>
                                                            <button
                                                                type="button"
                                                                aria-label="Toggle subcategories"
                                                                className="group p-1 rounded hover:bg-gray-100
                                           flex items-center justify-center"
                                                            >
                                                                <ChevronRight
                                                                    className="
                                    h-4 w-4 transition-transform duration-200
                                    group-data-[state=open]:rotate-90
                                  "
                                                                />
                                                            </button>
                                                        </CollapsibleTrigger>

                                                    </div>

                                                    {/* ---------- Subcategories ---------- */}
                                                    <CollapsibleContent>
                                                        <div className="ml-6 mt-3">

                                                            {/* Controls */}
                                                            <div className="flex gap-3 mb-2 text-xs">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSelectAllSub(category)}
                                                                    className="text-green-600 hover:underline"
                                                                >
                                                                    Select all
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleClearAllSub(category)}
                                                                    className="text-red-600 hover:underline"
                                                                >
                                                                    Clear all
                                                                </button>
                                                            </div>

                                                            {/* Subcategory list */}
                                                            <ul className="space-y-2">
                                                                {category.subCategories.map(sub => (
                                                                    <li key={sub._id}>
                                                                        <label className='flex items-center space-x-3 cursor-pointer text-sm'>
                                                                            <Checkbox
                                                                                checked={selectedSubCategories.includes(sub.slug)}
                                                                                onCheckedChange={() =>
                                                                                    handleSubCategoryFilter(category, sub.slug)
                                                                                }
                                                                            />
                                                                            <span>{sub.name}</span>
                                                                        </label>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </CollapsibleContent>

                                                </Collapsible>
                                            </li>
                                        )
                                    })}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ---------------- COLOR ---------------- */}
                <AccordionItem value="2">
                    <AccordionTrigger className='uppercase font-semibold hover:no-underline'>
                        color
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className='max-h-48 overflow-auto'>
                            <ul>
                                {colorData?.success && colorData.data.map((color, index) => (
                                    <li key={'CL' + index} className='mb-3'>
                                        <label className='flex items-center space-x-3 cursor-pointer'>
                                            <Checkbox
                                                onCheckedChange={() => handleColorFilter(color)}
                                                checked={selectedColor.includes(color)}
                                            />
                                            <span>{color}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ---------------- SIZE ---------------- */}
                <AccordionItem value="3">
                    <AccordionTrigger className='uppercase font-semibold hover:no-underline'>
                        size
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className='max-h-48 overflow-auto'>
                            <ul>
                                {sizeData?.success && sizeData.data.map((size, index) => (
                                    <li key={'SZ' + index} className='mb-3'>
                                        <label className='flex items-center space-x-3 cursor-pointer'>
                                            <Checkbox
                                                onCheckedChange={() => handleSizeFilter(size)}
                                                checked={selectedSize.includes(size)}
                                            />
                                            <span>{size}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ---------------- PRICE ---------------- */}
                <AccordionItem value="4">
                    <AccordionTrigger className='uppercase font-semibold hover:no-underline'>
                        price
                    </AccordionTrigger>
                    <AccordionContent>
                        <Slider
                            value={[priceFilter.minPrice, priceFilter.maxPrice]}
                            max={3000}
                            step={1}
                            onValueChange={handlePriceChange}
                        />
                        <div className='flex justify-between items-center pt-2'>
                            <span>
                                {priceFilter.minPrice.toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                })}
                            </span>
                            <span>
                                {priceFilter.maxPrice.toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                })}
                            </span>
                        </div>
                        <div className='mt-4'>
                            <ButtonLoading
                                onClick={handlePriceFilter}
                                type='button'
                                text='Filter Price'
                                className='rounded-full'
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    )
}

export default Filter
