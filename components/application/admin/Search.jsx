import { Input } from '@/components/ui/input'
import { IoIosSearch } from 'react-icons/io';
import SearchModal from './SearchModal';
import { useState } from 'react';


const Search = () => {
    const [open, setOpen] = useState(false);
  return (
    <div className='md:w-[350px]'>
        <div className='flex justify-center items-center relative'>
            <Input 
            readOnly
            className='rounded-full cursor-pointer'
            placeholder='Search...'
            onClick={() => setOpen(true)}
            />
            <button type='button' className='absolute right-3 cursor-default'>
                <IoIosSearch />
            </button>
        </div>
        <SearchModal open={open} setOpen={setOpen}/>
    </div>
  )
}

export default Search