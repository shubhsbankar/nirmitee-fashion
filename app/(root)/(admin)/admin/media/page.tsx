'use client'
import BreadCrumb from '@/components/application/admin/BreadCrumb';
import ButtonLoading from '@/components/application/ButtonLoading';
import Media from '@/components/application/admin/Media';
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoute';
import UploadMedia from '@/components/application/admin/UploadMedia';
import { Card, CardHeader, CardContent} from '@/components/ui/card';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Link  from 'next/link';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSearchParams } from 'next/navigation';
import useDeleteMutation from '@/hooks/useDeleteMutation';
import { useQueryClient } from '@tanstack/react-query';

const breadcrumbData = [
    {
        href : ADMIN_DASHBOARD, label: 'Home'
    },
    {
        href : '' , label: 'media'
    },
]

const MediaPage = () =>{
    const [deleteType, setDeleteType] = useState('SD');
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const queryClient = useQueryClient();
    
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams) {
            const trashOf = searchParams.get('trashof');
            setSelectedMedia([]);
            if (trashOf){
                setDeleteType('PD');
            }else {
                setDeleteType('SD');
            }
        }
    }, [searchParams])

    const fetchMedia = async (page, deleteType) => {
        const { data : response } = await axios.get(`/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`);
        console.log(response);
        return response;
    }
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
        status
	  } = useInfiniteQuery({
		queryKey: ['media-data', deleteType],
		queryFn: async ({ pageParam }) => fetchMedia(pageParam, deleteType),
		initialPageParam: 0,
		getNextPageParam: (lastPage, pages) => {
            const nextPage = pages.length;
            return lastPage.data.hasMore ? nextPage : undefined;
        },
	  });
      console.log('hasNextPage',hasNextPage);
      const deleteMutation = useDeleteMutation('media-data','/api/media/delete');

      const handleDelete = (ids, deleteType) => {
          let c = true;
          if (deleteType === 'PD'){
              c = confirm('Are you sure you want to delete the data permanently?');
          }

          if (c) {
              deleteMutation.mutate({ ids, deleteType});
          }

          setSelectAll(false);
          setSelectedMedia([]);
      };

      const handleSelectAll = () => {
            setSelectAll(!selectAll)
      };

      useEffect(() => {
          if (selectAll){
              const ids = data.pages?.flatMap(page => 
                                             page.data?.mediaData?.map(media => media._id));
              setSelectedMedia(ids);
          }else{
              setSelectedMedia([]);
          }
      }, [selectAll]); 

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData}/>
            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between items-center'>
                        <h4 className='font-semibold text-xl uppercase'>
                            {deleteType === 'SD' ? 'media' : 'media trash'}</h4>
                        <div className='flex items-center gap-5'>
                            {deleteType === 'SD' && <UploadMedia queryClient={queryClient} isMultiple={true}/> }
                            <div className='flex gap-3'>
                                {
                                    deleteType === 'SD' ? 
                                        <Button type='button' variant='destructive'>
                                            <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                                                Trash
                                            </Link>
                                        </Button>
                                        : 
                                        
                                        <Button type='button' >
                                            <Link href={ADMIN_MEDIA_SHOW}>
                                                Back To Media
                                            </Link>
                                        </Button>

                                }
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='pb-5'>
                    {
                        selectedMedia.length > 0 &&
                        <div className='py-2 px-3 bg-violet-200 mb-2 rounded flex justify-between items-center'>
                            <Label>
                                <Checkbox 
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                    className='border-primary cursor-pointer'
                                />
                                Select All
                            </Label>
                            <div className='flex gap-2'>
                                {
                                    deleteType === 'SD' ?
                                        <Button className='cursor-pointer'
                                        variant='destructive' onClick={() => 
                                            handleDelete(selectedMedia,deleteType)}>
                                            Move Into Trash
                                        </Button>
                                        :
                                        <>
                                            <Button  className='cursor-pointer bg-green-500 hover:bg-green-600' onClick={() => 
                                                handleDelete(selectedMedia,'RSD')}>
                                                Restore
                                            </Button>
                                            <Button className='cursor-pointer' variant='destructive' onClick={() => 
                                                handleDelete(selectedMedia,deleteType)}>
                                                Delete Permenently
                                            </Button>
                                        </>
                            }
                            </div>
                        </div>
                    }
                    {
                        status === 'pending' ?
                            <div>Loading...</div>
                            :
                            status === 'error' ?
                                <div className='text-red-500 text-sm'>
                                    { error.message }
                                </div>
                            :
                            <>
                                {data.pages?.flatMap(page => 
                                             page.data?.mediaData?.map(media => media._id)).length === 0 
                                && <div>Data not found.</div>
                                }
                                <div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5'>
                                    {
                                        data?.pages?.map((page,index) => {
                                         return   <React.Fragment key={index}>
                                                {
                                                    page?.data?.mediaData?.map((media) => <Media key={media._id} 
                                                            media={media}
                                                            handleDelete={handleDelete}
                                                            deleteType={deleteType}
                                                            selectedMedia={selectedMedia}
                                                            setSelectedMedia={setSelectedMedia}
                                                        />)
                                                }                                           
                                            </React.Fragment>
                                        })
                                    }
                                </div>
                            </>
                    }
                    {
                        hasNextPage &&
                       
                        <ButtonLoading type='button' loading={isFetching} 
                            className='cursor-pointer' text='Load More' 
                            onClick={() => fetchNextPage()}/>
                    }
                </CardContent>
            </Card>
        </div>
    );
};

export default MediaPage;
