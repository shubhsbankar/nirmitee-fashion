'use client'
import {  useMemo, useCallback } from 'react';
import { ADMIN_DASHBOARD,  ADMIN_TRASH, } from '@/routes/AdminPanelRoute';
import BreadCrumb  from '@/components/application/admin/BreadCrumb';
import { Card, CardHeader, CardContent} from '@/components/ui/card';
import DatatableWrapper from '@/components/application/admin/DatatableWrapper';
import { columnConfig } from '@/lib/clientHelperFunctions';
import { DT_REVIEW_COLUMN } from '@/lib/column';
import DeleteAction  from '@/components/application/admin/DeleteAction';

const breadcrumbData = [
   {
      href:  ADMIN_DASHBOARD,
      label: 'Home'
   },
   {
      href: '',
      label: 'Reviews'
   },
   ];

const ShowReview = () =>{

    const columns = useMemo(() => {
      return columnConfig(DT_REVIEW_COLUMN)
    },[]);

    const action = useCallback((row,deleteType,handleDelete) => {
    let actionMenu = [];
    actionMenu.push(<DeleteAction  key='delete' handleDelete={handleDelete} row={row}
                    deleteType={deleteType}/>)
    return actionMenu;
    }, []);

    return (
        <div>
           <BreadCrumb breadcrumbData={breadcrumbData} />
         <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between'>
                        <h4 className='font-semibold text-xl'>Reviews</h4>
                    </div>
                </CardHeader>
                <CardContent className='pb-5 px-0'>

                 <DatatableWrapper 
                     queryKey='review-data'
                     fetchUrl='/api/review'
                     initialPageSize={10}
                     columnConfig={columns}
                     exportEndpoint='/api/review/export'
                     deleteEndpoint='/api/review/delete'
                     deleteType='SD'
                     trashView={`${ADMIN_TRASH}?trashof=review`}
                     createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    );
};


export default ShowReview;
