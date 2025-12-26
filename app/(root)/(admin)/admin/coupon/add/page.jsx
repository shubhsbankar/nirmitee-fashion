'use client'
import { useState, useEffect } from 'react';
import { ADMIN_DASHBOARD, ADMIN_COUPON_SHOW } from '@/routes/AdminPanelRoute';
import BreadCrumb from '@/components/application/admin/BreadCrumb';
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
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import ButtonLoading from '@/components/application/ButtonLoading';
import { showToast } from '@/lib/showToast';
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from 'slugify';
import useFetch from '@/hooks/useFetch';
import Select from '@/components/application/select';
import Editor from '@/components/application/admin/Editor';
import MediaModal from '@/components/application/admin/MediaModal';
import Image from 'next/image';

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: 'Home'
  },
  {
    href: ADMIN_COUPON_SHOW,
    label: 'Coupons'
  },
  {
    href: '',
    label: 'Add Coupon'
  },
];

const AddCoupon = () => {
  const [loading, setLoading] = useState(false);

 


  const form = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      validity: "",
      minShoppingAmount: 0,
      code: '',
      discountPercentage: 0,
    },
  });




  const onSubmit = async (values) => {
    
    setLoading(true);
    try {
      const { data: response } = await axios.post('/api/coupon/create', values);
      if (!response.success) {
        throw new Error(response.message);
      }
      
      showToast('success', response.message);
      form.reset();
    }
    catch (error) {
      
      showToast('error', error.message);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className='py-0 rounded shadow-sm'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <h4 className='font-semibold text-xl'>Add Coupon</h4>
        </CardHeader>
        <CardContent className='pb-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
              <div className='grid md:grid-cols-2 gap-5'>
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
                <ButtonLoading type="submit" text="Add Coupon" loading={loading} className={" cursor-pointer"} />
              </div>
            </form>
          </Form>

        </CardContent>
      </Card>
    </div>
  );
};

export default AddCoupon;
