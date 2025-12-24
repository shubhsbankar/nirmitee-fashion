import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import loading from "@/public/assets/images/loading.svg";
import Image from "next/image";
import React, { useState } from "react";
import ModalMediaBlock from "./ModalMediaBlock";
import { showToast } from "@/lib/showToast";
import ButtonLoading from "../ButtonLoading";

const MediaModal = ({
  open,
  setOpen,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
}) => {

  const [previouslySelected, setPreviouslySelected] = useState([]);
  console.log("open", open);
  
  // Initialize previouslySelected when modal opens
  React.useEffect(() => {
    if (open) {
      setPreviouslySelected(selectedMedia);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fetchMedia = async (page) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&&limit=18&&deleteType=SD`
    );
    return response;
  };

  const {
    isPending,
    isError,
    data,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["MediaModal"],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.data.hasMore ? nextPage : undefined;
    },
  });

  const handleClear = () => {
    setPreviouslySelected([]);
    setSelectedMedia([]);
    showToast('success','Media selection cleared.');
  };

  const handleClose = () => {
    setSelectedMedia(previouslySelected); // Restore previous selection
    setOpen(false);
  };

  const handleSelect = () => {
    if (selectedMedia.length <= 0) {
      return showToast('error','Please select a media');
    }
    setPreviouslySelected(selectedMedia); // Save current selection
    setOpen(false); // Close modal after selection
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[80%] h-[90vh] p-0 bg-white dark:bg-card border shadow-lg flex flex-col overflow-hidden"
        showCloseButton={true}
      >
        <DialogDescription className="hidden"></DialogDescription>
        <DialogHeader className="h-10 border-b px-3 pt-3">
          <DialogTitle>Media Selection</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-2">
          {isPending ? (
            <div className="size-full flex justify-center items-center">
              <Image src={loading} height={80} width={80} alt={"Loading"} />
            </div>
          ) : isError ? (
            <div className="size-full flex justify-center items-center">
              <span className="text-red-500">{error.message}</span>
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-6 grid-cols-3 gap-2">
                {data?.pages?.map((page, index) => {
                  return (
                    <React.Fragment key={index}>
                      {page?.data?.mediaData?.map((media) => (
                        <ModalMediaBlock
                          key={media._id}
                          media={media}
                          selectedMedia={selectedMedia}
                          setSelectedMedia={setSelectedMedia}
                          isMultiple={isMultiple}
                        />
                      ))}
                    </React.Fragment>
                  );
                })}
              </div>
                  {

                    hasNextPage &&

                    <ButtonLoading type='button' loading={isFetching}
                      className='cursor-pointer mt-3' text='Load More'
                      onClick={() => fetchNextPage()} />

                  }
            </>
          )}
        </div>
        <div className="h-20 pt-3 border-t flex justify-between px-3 pb-3 ">
          <div >
            <Button type="button" variant="destructive" onClick={handleClear} className='cursor-pointer'>
              Clear All
            </Button>
          </div>
          <div className="flex gap-5">
            <Button type="button" variant="secondary" onClick={handleClose} className='cursor-pointer'>
              Close
            </Button>
            <Button type="button" onClick={handleSelect} className='cursor-pointer'>
              Select
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaModal;
