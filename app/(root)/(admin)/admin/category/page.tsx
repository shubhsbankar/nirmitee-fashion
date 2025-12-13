'use client'
import {  useState, useEffect, useMemo, useCallback } from 'react';
import { ADMIN_DASHBOARD, ADMIN_CATEGORY_SHOW, ADMIN_CATEGORY_ADD, ADMIN_TRASH,
ADMIN_CATEGORY_EDIT } from '@/routes/AdminPanelRoute';
import BreadCrumb  from '@/components/application/admin/BreadCrumb';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { categorySchema } from '@/lib/zodSchema'
import { Card, CardHeader, CardContent} from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ButtonLoading from '@/components/application/ButtonLoading';
import { showToast } from '@/lib/showToast';
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from 'slugify';
import { FiPlus } from "react-icons/fi";
import Link from 'next/link';
import DatatableWrapper from '@/components/application/admin/DatatableWrapper';
import { columnConfig } from '@/lib/clientHelperFunctions';
import { DT_CATEGORY_COLUMN } from '@/lib/column';
import EditAction  from '@/components/application/admin/EditAction';
import DeleteAction  from '@/components/application/admin/DeleteAction';

const breadcrumbData = [
   {
      href:  ADMIN_DASHBOARD,
      label: 'Home'
   },
   {
      href: ADMIN_CATEGORY_SHOW,
      label: 'Category'
   },
   ];

const ShowCategory = () =>{

    const columns = useMemo(() => {
      return columnConfig(DT_CATEGORY_COLUMN)
    },[]);

    const action = useCallback((row,deleteType,handleDelete) => {
    let actionMenu = [];
    actionMenu.push(<EditAction href={ADMIN_CATEGORY_EDIT(row.original._id)} key='edit' />)
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
                        <h4 className='font-semibold text-xl'>Show Category</h4>
                        <Button>
                           <FiPlus />
                            <Link href={ADMIN_CATEGORY_ADD}>New Category</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className='pb-5 px-0'>

                 <DatatableWrapper 
                     queryKey='category-data'
                     fetchUrl='/api/category'
                     initialPageSize={10}
                     columnConfig={columns}
                     exportEndpoint='/api/category/export'
                     deleteEndpoint='/api/category/delete'
                     deleteType='SD'
                     trashView={`${ADMIN_TRASH}?trashof=category`}
                     createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    );
};


export default ShowCategory;


