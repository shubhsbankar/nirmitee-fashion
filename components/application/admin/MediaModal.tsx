import { Button } from '@/components/ui/button';
import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const MediaModal = ( { open, setOpen, selectedMedia, setSelectedMedia, isMultiple }) => {
  const handleClear =() => {

  }

  const handleClose =() => {

  }
  
  const handleSelect =() => {

  }

  return (
   <Dialog 
      open= { open } 
      onOpenChange={ () => setOpen(!open)} 
    >
      <DialogContent
      onInteractOutside={ (e) => e.preventDefault() }
      className='sm:max-w-[80%] h-screen p-0 py-10 bg-transparent border-0 shadown-none'
      >
       <DialogDescription className='hidden'></DialogDescription>
      </DialogContent>
     <div className='h-[90vh] bg-white p-3 rounded shadow'>
        <DialogHeader className='h-8 border-b'>
               <DialogTitle>Media Selection</DialogTitle>
        </DialogHeader>
        <div className=''>

        </div>
        <div className='h-10 pt-3 border-t flex justify-between'>
          <div>
            <Button type='button' variant='destructive' onClick={handleClear}>Clear All</Button>
          </div>
          <div className='flex gap-5'>
            <Button type='button' variant='secondary' onClick={handleClose}>Close</Button>
            <Button type='button' onClick={handleSelect}>Select</Button>

          </div>

        </div>
      </div>
  </Dialog>
  )
}

export default MediaModal;
