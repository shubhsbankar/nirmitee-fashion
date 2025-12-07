'use client'
import {  useMemo, useCallback } from 'react';
import { ADMIN_DASHBOARD,  ADMIN_TRASH, } from '@/routes/AdminPanelRoute';
import BreadCrumb  from '@/components/application/admin/BreadCrumb';
import { Card, CardHeader, CardContent} from '@/components/ui/card';
import DatatableWrapper from '@/components/application/admin/DatatableWrapper';
import { columnConfig } from '@/lib/clientHelperFunctions';
import { DT_CUSTOMERS_COLUMN } from '@/lib/column';
import DeleteAction  from '@/components/application/admin/DeleteAction';

const breadcrumbData = [
   {
      href:  ADMIN_DASHBOARD,
      label: 'Home'
   },
   {
      href: '',
      label: 'Customers'
   },
   ];

const ShowCustomers = () =>{

    const columns = useMemo(() => {
      return columnConfig(DT_CUSTOMERS_COLUMN)
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
                        <h4 className='font-semibold text-xl'>Customers</h4>
                    </div>
                </CardHeader>
                <CardContent className='pb-5 px-0'>

                 <DatatableWrapper 
                     queryKey='customers-data'
                     fetchUrl='/api/customers'
                     initialPageSize={10}
                     columnConfig={columns}
                     exportEndpoint='/api/customers/export'
                     deleteEndpoint='/api/customers/delete'
                     deleteType='SD'
                     trashView={`${ADMIN_TRASH}?trashof=customers`}
                     createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    );
};


export default ShowCustomers;
