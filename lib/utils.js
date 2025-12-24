import { twMerge } from "tailwind-merge"
import clsx from 'clsx';

export function cn(...inputs  
) {
  return twMerge(clsx(inputs))
}

export const sizes = [{label :'S', value: 'S'},
  {label :'M', value: 'M'},
  {label :'L', value: 'L'},
  {label :'XL', value: 'XL'},
  {label :'2XL', value: '2XL'},
  { label: '3XL', value: '3XL' }];
  
export const sortings = [
  { label: 'Default Sorting', value: 'default_sorting' },
  { label: 'Ascending Order', value: 'asc' },
  { label: 'Descending', value: 'desc' },
  { label: 'Price: Low To High', value: 'price_low_high' },
  { label: 'Price: High To Low', value: 'price_high_low' },
]

export const orderStatus = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'unverified'];