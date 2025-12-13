/*'use client'
import {  useState, useEffect } from 'react';
import { ADMIN_DASHBOARD, ADMIN_CATEGORY_SHOW } from '@/routes/AdminPanelRoute';
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
import ButtonLoading from '@/components/application/ButtonLoading';
import { showToast } from '@/lib/showToast';
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from 'slugify';

const breadcrumbData = [
   {
      href:  ADMIN_DASHBOARD,
      label: 'Home'
   },
   {
      href: ADMIN_CATEGORY_SHOW,
      label: 'Category'
   },
   {
      href: '',
      label: 'Add Category'
   },
];

const AddCategory = () =>{
  const [ loading, setLoading] = useState<boolean>(false);

  const form = useForm({
        resolver: zodResolver(categorySchema),
    defaultValues: {
       name: "",
       slug : "",
    },
  });

  useEffect(() => {
     const name = form.getValues('name');
     if(name) {
        form.setValue('slug', slugify(name).toLowerCase())
     }
  }, [form.watch('name')]);


  const onSubmit = async (values) => {
    console.log(values);
    setLoading(true);
	try {
		const {data : response } = await axios.post('/api/category/create',values);
		if ( !response.success ){
			throw new Error(response.message);
		}
		console.log(response.message)
        showToast('success',response.message);
        form.reset();
	}
	catch (error) {
		console.log(error.message)
        showToast('error',error.message);
	}
	finally{
		setLoading(false);
        }
  }

    return (
        <div>
           <BreadCrumb breadcrumbData={breadcrumbData} />
         <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                 <h4 className='font-semibold text-xl'>Add Category</h4>        
                </CardHeader>
                <CardContent className='pb-5'>
                   <Form {...form}>
			 <form onSubmit={form.handleSubmit(onSubmit)} >
             <div className='mb-5'>
				  <FormField
					control={form.control}
					name="name"
					render={({ field }) => (
					  <FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
						  <Input type="text" placeholder="Enter category name" {...field} />
						</FormControl>
						<FormMessage />
					  </FormItem>
					)}
				  />
            </div>
             <div className='mb-5'>
				  <FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
					  <FormItem>
						<FormLabel>Slug</FormLabel>
						<FormControl>
						  <Input type="text" placeholder="Enter category slug" {...field} />
						</FormControl>
						<FormMessage />
					  </FormItem>
					)}
				  />
            </div>
              
               <div className='mb-3'>
                 <ButtonLoading type="submit" text="Add Category" loading={loading} className={" cursor-pointer"}/>
               </div>
			</form>
			</Form>

                </CardContent>
            </Card>
        </div>
    );
};



export default AddCategory;
*/

'use client'

import React, { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import slugify from 'slugify'

import { ADMIN_DASHBOARD, ADMIN_CATEGORY_SHOW } from '@/routes/AdminPanelRoute'
import BreadCrumb from '@/components/application/admin/BreadCrumb'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/application/ButtonLoading'
import { showToast } from '@/lib/showToast'
import { categorySchema } from '@/lib/zodSchema'

/** Derive the form data type from your zod schema so it stays in sync */
type CategoryForm = z.infer<typeof categorySchema>

/** axios response shape (adjust if your API returns different fields) */
type CreateCategoryResponse = {
  success: boolean
  message: string
}

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: 'Home',
  },
  {
    href: ADMIN_CATEGORY_SHOW,
    label: 'Category',
  },
  {
    href: '',
    label: 'Add Category',
  },
]

const AddCategory: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  })

  /**
   * Keep slug in sync with name.
   * We use form.watch('name') in the dependency array to re-run effect when name changes.
   */
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name') {
        const currentName = value.name ?? ''
        if (currentName) {
          form.setValue('slug', slugify(currentName).toLowerCase())
        } else {
          form.setValue('slug', '')
        }
      }
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])

  /** onSubmit typed to CategoryForm; safe error handling included */
  const onSubmit = async (values: CategoryForm): Promise<void> => {
    setLoading(true)
    try {
      const { data: response } = await axios.post<CreateCategoryResponse>(
        '/api/category/create',
        values
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to create category')
      }

      showToast('success', response.message)
      form.reset()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : (axios.isAxiosError(err) && err.response?.data?.message) || String(err)
      showToast('error', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="font-semibold text-xl">Add Category</h4>
        </CardHeader>

        <CardContent className="pb-5">
          {/* react-hook-form integrated UI wrapper */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter category slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <ButtonLoading onClick={() => { } } type="submit" text="Add Category" loading={loading} className=" cursor-pointer" />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddCategory
