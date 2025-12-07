'use client'
import {  useMemo, useCallback } from 'react';
import { ADMIN_DASHBOARD, ADMIN_COUPON_SHOW, ADMIN_COUPON_ADD, ADMIN_TRASH,
ADMIN_COUPON_EDIT } from '@/routes/AdminPanelRoute';
import BreadCrumb  from '@/components/application/admin/BreadCrumb';
import { Card, CardHeader, CardContent} from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import Link from 'next/link';
import DatatableWrapper from '@/components/application/admin/DatatableWrapper';
import { columnConfig } from '@/lib/clientHelperFunctions';
import { DT_COUPON_COLUMN } from '@/lib/column';
import EditAction  from '@/components/application/admin/EditAction';
import DeleteAction  from '@/components/application/admin/DeleteAction';

const breadcrumbData = [
   {
      href:  ADMIN_DASHBOARD,
      label: 'Home'
   },
   {
      href: ADMIN_COUPON_SHOW,
      label: 'Coupon'
   },
   ];

const ShowCoupon = () =>{

    const columns = useMemo(() => {
      return columnConfig(DT_COUPON_COLUMN)
    },[]);

    const action = useCallback((row,deleteType,handleDelete) => {
    let actionMenu = [];
    actionMenu.push(<EditAction href={ADMIN_COUPON_EDIT(row.original._id)} key='edit' />)
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
                        <h4 className='font-semibold text-xl'>Show Coupon</h4>
                        <Button>
                           <FiPlus />
                            <Link href={ADMIN_COUPON_ADD}>New Coupon</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className='pb-5 px-0'>

                 <DatatableWrapper 
                     queryKey='coupon-data'
                     fetchUrl='/api/coupon'
                     initialPageSize={10}
                     columnConfig={columns}
                     exportEndpoint='/api/coupon/export'
                     deleteEndpoint='/api/coupon/delete'
                     deleteType='SD'
                     trashView={`${ADMIN_TRASH}?trashof=coupon`}
                     createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    );
};


export default ShowCoupon;
