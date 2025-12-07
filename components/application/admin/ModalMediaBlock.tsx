import { Checkbox } from '@/components/ui/checkbox'
import React from 'react'
import Image from 'next/image'

interface MediaItem {
  id: string;
  url: string;
}

interface ModalMediaBlockProps {
  media: {
    _id: string;
    secure_url: string;
    alt?: string;
  };
  selectedMedia: MediaItem[];
  setSelectedMedia: (media: MediaItem[]) => void;
  isMultiple?: boolean;
}

const ModalMediaBlock = ({ media, selectedMedia, setSelectedMedia, isMultiple }: ModalMediaBlockProps) => {
  
    const handleCheck = () => {
        const isSelected = selectedMedia.find(m => m.id === media._id) ? true : false;
        if (isMultiple) {
            let newSelectedMedia: MediaItem[] = [];
            if (isSelected) {
                newSelectedMedia = selectedMedia.filter((m) => m.id !== media._id);
            } else {
                newSelectedMedia = [...selectedMedia, {id: media._id, url: media.secure_url}];
            }
            setSelectedMedia(newSelectedMedia);
        } else {
            setSelectedMedia([{id: media._id, url: media.secure_url}]);
        }
    }
    
    return (
        <label htmlFor={media._id} className='border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden cursor-pointer'>
            <div className='absolute z-20 top-2 left-2'>
                <Checkbox
                    checked={selectedMedia.find((m) => m.id === media._id) ? true : false}
                    onCheckedChange={handleCheck}
                    className={'border-primary cursor-pointer'} 
                />
            </div>
            <div>
                <Image
                    src={media.secure_url}
                    alt={media.alt || ''}
                    width={300}
                    height={300}
                    className='object-cover md:h-[150px] h-[100px]' 
                />
            </div>
        </label>
    )
}

export default ModalMediaBlock