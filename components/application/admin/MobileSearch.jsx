import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { IoIosSearch } from 'react-icons/io';
import SearchModal from './SearchModal';


const MobileSearch = () => {
    const [open, setOpen] = useState(false);

  return (
    <>
    <Button type='button' size='icon'
    onClick={() => setOpen(true)}  className='md:hidden' variant='ghost' >
        <IoIosSearch />
    </Button>
    <SearchModal open={open} setOpen={setOpen}/>
    </>
  )
}

export default MobileSearch