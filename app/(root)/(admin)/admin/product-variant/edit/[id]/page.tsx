'use client'
import { use, useState, useEffect } from 'react';
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_VARIANT_SHOW } from '@/routes/AdminPanelRoute';
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
import { productVariantSchema } from '@/lib/zodSchema'
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
import { sizes } from '@/lib/utils'

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: 'Home'
  },
  {
    href: ADMIN_PRODUCT_VARIANT_SHOW,
    label: 'Product Variant'
  },
  {
    href: '',
    label: 'Edit Product Variant'
  },
];

const EditProduct = ({ params }) => {
  const { id } = use(params);
  const [loading, setLoading] = useState<boolean>(false);
  const [productOption, setProductOption] = useState([]);
  const { data: getProduct } = useFetch('/api/product?deleteType=SD&&size=10000');

  const { data: getProductVariant, loading: isProductLoading } = useFetch(`/api/product-variant/get/${id}`);
  

  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Array<{ id: string; url: string }>>([]);

  useEffect(() => {
    if (getProduct && getProduct.success) {
      const data = getProduct.data;
      const options = data.map((p) => ({ label: p.name, value: p._id }));
      setProductOption(options);
    }
  }, [getProduct]);


  useEffect(() => {
    const data = getProductVariant?.data;
    if (getProductVariant && getProductVariant.success) {

      // const cat = {label: data?.category?.name,value: data?.category?._id};
      // // setProductOption([cat]);
      // setCategoryData(cat);

      form.reset({
        _id: id,
        product: data?.product?._id,
        color: data?.color,
        size: data?.size,
        mrp: data?.mrp,
        sellingPrice: data?.sellingPrice,
        discountPercentage: data?.discountPercentage,
        sku: data?.sku,
        stock: data?.stock
      })
    }

    if (data?.media) {
      const media = data.media.map(m => ({ id: m._id, url: m.secure_url }))
      setSelectedMedia(media);
    }

  }, [getProductVariant]);

  const form = useForm({
    resolver: zodResolver(productVariantSchema),
    defaultValues: {
      _id: id,
      product: "",
      color: "",
      sku: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      stock: 0,
      size: '',
    },
  });



  useEffect(() => {
    const mrp = Number(form.getValues("mrp")) || 0;
    const sellingPrice = Number(form.getValues("sellingPrice")) || 0;

    if (mrp > 0 && sellingPrice > 0) {
      const val = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue("discountPercentage", Math.round(val));
    }


  }, [form.watch('mrp'), form.watch('sellingPrice')]);

  const editor = (event, editor) => {
    const data = editor.getData();
    form.setValue('description', data);
  }

  const onSubmit = async (values) => {
    
    setLoading(true);
    try {
      if (selectedMedia.length <= 0) {
        return showToast('error', 'Please select media.');
      }
      values.media = selectedMedia.map(m => m.id);

      const { data: response } = await axios.put('/api/product-variant/update', values);
      if (!response.success) {
        throw new Error(response.message);
      }
      
      showToast('success', response.message);
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
          <h4 className='font-semibold text-xl'>Edit Product Variant</h4>
        </CardHeader>
        <CardContent className='pb-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
              <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={productOption}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                <div className=''>
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter Stock Keeping Unit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>




                <div className=''>
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className=''>
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={sizes}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className=''>
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter Stock" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                <div className=''>
                  <FormField
                    control={form.control}
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter MRP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className=''>
                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter Selling Price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='mb-5'>
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Percentage<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="number" readOnly placeholder="Enter Discount Percentage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className='md:col-span-2 border border rounded p-5 text-center'>
                <MediaModal open={open} setOpen={setOpen} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia}
                  isMultiple={true} />
                {
                  selectedMedia.length > 0 &&
                  <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
                    {
                      selectedMedia.map(m => (
                        <div key={m.id} className='h-24 w-24 border'>
                          <Image
                            src={m.url}
                            height={100}
                            width={100}
                            alt={m.alt || ''}
                            className='size-full object-cover'
                          />
                        </div>
                      ))
                    }
                  </div>
                }
                <div onClick={() => { setOpen(true) }} className='bg-gray-50 dark:bg-card border w-[200px] mx-auto
                  p-5 cursor-pointer'>
                  <span className='semi-bold'>Select Media</span>
                </div>
              </div>

              <div className='mt-5'>
                <ButtonLoading type="submit" text="Save Changes" loading={loading} className={" cursor-pointer"} />
              </div>
            </form>
          </Form>

        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;
