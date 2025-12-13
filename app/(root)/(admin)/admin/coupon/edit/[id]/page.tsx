/*'use client'
import {  use,useState, useEffect } from 'react';
import { ADMIN_DASHBOARD, ADMIN_COUPON_SHOW } from '@/routes/AdminPanelRoute';
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
import { couponSchema } from '@/lib/zodSchema'
import { Card, CardHeader, CardContent} from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import ButtonLoading from '@/components/application/ButtonLoading';
import { showToast } from '@/lib/showToast';
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from '@/hooks/useFetch';
import * as dayjs from 'dayjs';

const breadcrumbData = [
   {
      href:  ADMIN_DASHBOARD,
      label: 'Home'
   },
   {
      href: ADMIN_COUPON_SHOW,
      label: 'Coupons'
   },
   {
      href: '',
      label: 'Edit Coupon'
   },
];

const EditCoupon = ({ params }) =>{
    const {id} = use(params);
  const [ loading, setLoading] = useState<boolean>(false);


  const {data : getCoupon, loading: isCouponLoading } = useFetch(`/api/coupon/get/${id}`);
  console.log('getCoupon',getCoupon);

 

  useEffect( () => {
     const data = getCoupon?.data;
     if (getCoupon && getCoupon.success){
        
  
        form.reset({
            _id:id,
                   code: data?.code,
       validity :  dayjs(data?.validity).format('YYYY-MM-DD'),
       minShoppingAmount:data?.minShoppingAmount,
       discountPercentage: data?.discountPercentage,
        })
     }

  },[getCoupon]); 

  const form = useForm({
        resolver: zodResolver(couponSchema),
    defaultValues: {
        _id: id,
       code: "",
       validity : "",
       minShoppingAmount:"",
       discountPercentage: 0,

    },
  });


   const onSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    try {
     
          const {data : response } = await axios.put('/api/coupon/update',values);
        if ( !response.success ){
            throw new Error(response.message);
        }
        console.log(response.message)
        showToast('success',response.message);
        }
    catch (error) {
        console.log(error.message)
        showToast('error',error.message);
    }
    finally{
        setLoading(false);
        }
  }

  //console.log('form.getValues',form.getValues('description')) 

    return (
        <div>
           <BreadCrumb breadcrumbData={breadcrumbData} />
         <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                 <h4 className='font-semibold text-xl'>Edit Coupon</h4>        
                </CardHeader>
                <CardContent className='pb-5'>
                   <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} >
                      <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
  
                <div className=''>
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Percentage<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter Discount Percentage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="minShoppingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min. Shopping Amount<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter Min. Shopping Amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="validity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validity<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="date"  placeholder="Enter Validity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
               </div>

               <div className='mt-5'>
                 <ButtonLoading type="submit" text="Update Coupon" loading={loading} className={" cursor-pointer"}/>
               </div>
            </form>
            </Form>

                </CardContent>
            </Card>
        </div>
    );
};

export default EditCoupon;
*/


'use client'

import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import dayjs from 'dayjs'

import { ADMIN_DASHBOARD, ADMIN_COUPON_SHOW } from '@/routes/AdminPanelRoute'
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
import useFetch from '@/hooks/useFetch'
import { couponSchema } from '@/lib/zodSchema'

/** Derived form data type from your zod schema */
type CouponForm = z.infer<typeof couponSchema>

/** Component props shape for Next.js app-router page */
type EditCouponProps = {
  params: {
    id: string
  }
}

/** Generic fetch response shape used by your useFetch hook (adjust if needed) */
type FetchResponse<T = any> = {
  success: boolean
  data?: T
  message?: string
}

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: 'Home',
  },
  {
    href: ADMIN_COUPON_SHOW,
    label: 'Coupons',
  },
  {
    href: '',
    label: 'Edit Coupon',
  },
]

const EditCoupon: React.FC<EditCouponProps> = ({ params }) => {
  const { id } = params
  const [loading, setLoading] = useState<boolean>(false)

  // Initialize form first so effects can reference it safely
  const form = useForm<CouponForm>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      // Keep _id only if your schema includes it; otherwise remove.
      // _id: id,
      code: '',
      validity: '',
      minShoppingAmount: 0,
      discountPercentage: 0,
    },
  })

  // Fetch coupon data
  const { data: getCoupon, loading: isCouponLoading } = useFetch<FetchResponse>(`/api/coupon/get/${id}`)

  // When fetch returns, populate the form. dayjs used to format date for <input type="date" />
  useEffect(() => {
    if (getCoupon && getCoupon.success && getCoupon.data) {
      const data = getCoupon.data as Partial<CouponForm>
      form.reset({
        // _id: id, // uncomment if your schema/form contains _id
        code: data.code ?? '',
        validity: data.validity ? dayjs(data.validity as string).format('YYYY-MM-DD') : '',
        minShoppingAmount: (data.minShoppingAmount as number) ?? 0,
        discountPercentage: (data.discountPercentage as number) ?? 0,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCoupon])

  const onSubmit = async (values: CouponForm) => {
    setLoading(true)
    try {
      const { data: response } = await axios.put<{ success: boolean; message: string }>('/api/coupon/update', values)

      if (!response.success) {
        throw new Error(response.message || 'Failed to update coupon')
      }

      showToast('success', response.message)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : axios.isAxiosError(err) ? err.response?.data?.message ?? String(err) : String(err)
      console.error(message)
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
          <h4 className="font-semibold text-xl">Edit Coupon</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <div>
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Code<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Discount Percentage<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter Discount Percentage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="minShoppingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Min. Shopping Amount<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter Min. Shopping Amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="validity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Validity<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" placeholder="Enter Validity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="mt-5">
                <ButtonLoading type="submit" text="Update Coupon" loading={loading} className=" cursor-pointer" />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditCoupon
