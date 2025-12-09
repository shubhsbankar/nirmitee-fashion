'use client'
import {  use,useState, useEffect } from 'react';
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from '@/routes/AdminPanelRoute';
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
import { productSchema } from '@/lib/zodSchema'
import { Card, CardHeader, CardContent} from '@/components/ui/card';
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
      href:  ADMIN_DASHBOARD,
      label: 'Home'
   },
   {
      href: ADMIN_PRODUCT_SHOW,
      label: 'Products'
   },
   {
      href: '',
      label: 'Edit Product'
   },
];

const EditProduct = ({ params }) =>{
    const {id} = use(params);
  const [ loading, setLoading] = useState<boolean>(false);
  const [ categoryOption, setCategoryOption] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const {data : getCategory } = useFetch('/api/category?deleteType=SD&&size=10000');

  const {data : getProduct, loading: isProductLoading } = useFetch(`/api/product/get/${id}`);
  console.log('getProduct',getProduct);

  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Array<{id: string; url: string}>>([]);

 useEffect(() => {
     if (getCategory && getCategory.success){
        const data = getCategory.data;
        const options = data.map((cat) => ({label: cat.name, value: cat._id}));
        setCategoryOption(options);
     }
  },[getCategory]); 
  

  useEffect( () => {
     const data = getProduct?.data;
     if (getProduct && getProduct.success){
        
        const cat = {label: data?.category?.name,value: data?.category?._id};
        // setCategoryOption([cat]);
        setCategoryData(cat);

        form.reset({
            _id:id,
                   name: data?.name,
       slug : data?.slug,
       category:data?.category?._id,
       mrp:data?.mrp,
       sellingPrice: data?.sellingPrice,
       discountPercentage: data?.discountPercentage,
       description: data?.description,
        })
     }

     if(data?.media){
        const media = data.media.map(m => ({id:m._id, url:m.secure_url}))
        setSelectedMedia(media);
     }

  },[getProduct]); 

  const form = useForm({
        resolver: zodResolver(productSchema),
    defaultValues: {
        _id: id,
       name: "",
       slug : "",
       category:"",
       mrp:0,
       sellingPrice: 0,
       discountPercentage: 0,
       description: "",
    },
  });

  useEffect(() => {
     const name = form.getValues('name');
     if(name) {
        form.setValue('slug', slugify(name).toLowerCase())
     }
  }, [form.watch('name')]);

  useEffect(() => {
    const mrp = Number(form.getValues("mrp")) || 0;
    const sellingPrice = Number(form.getValues("sellingPrice")) || 0;
    
    if (mrp > 0 && sellingPrice > 0) {
      const val = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue("discountPercentage", Math.round(val));
    }
    
    
 }, [form.watch('mrp'),form.watch('sellingPrice')]);

  const editor = (event, editor) => {
  const data = editor.getData();
  form.setValue('description',data); 
  }

  const onSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    try {
    if (selectedMedia.length <= 0 )
    {
      return showToast('error','Please select media.');
    }
    values.media = selectedMedia.map(m => m.id);
    
    values.category = categoryData.value;
    //lues._id = id;
        const {data : response } = await axios.put('/api/product/update',values);
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
                 <h4 className='font-semibold text-xl'>Edit Product</h4>        
                </CardHeader>
                <CardContent className='pb-5'>
                   <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} >
                      <div className='grid md:grid-cols-2 grid-cols-1  gap-5'>
             <div className=''>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel>Name<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </div>
             <div className=''>
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter product slug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </div>
             <div className=''>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category<span className='text-red-500'>*</span></FormLabel>
                          <FormControl>
                           <Select
                              options={categoryOption}
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
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP<span className='text-red-500'>*</span></FormLabel>
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

            <div className=''>
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
            <div className='mb-5 md:col-span-2'>
               <FormLabel className='mb-2'>Description<span className='text-red-500'>*</span></FormLabel>
               {
                !isProductLoading && <Editor onChange={editor} initialData={form.getValues('description')}/>
               }
                        
                        <FormMessage />
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
                <div onClick={() => {setOpen(true)}} className='bg-gray-50 dark:bg-card border w-[200px] mx-auto
                  p-5 cursor-pointer'>
                  <span className='semi-bold'>Select Media</span>
                </div>
              </div>
               
               <div className='mt-5'>
                 <ButtonLoading type="submit" text="Save Changes" loading={loading} className={" cursor-pointer"}/>
               </div>
            </form>
            </Form>

                </CardContent>
            </Card>
        </div>
    );
};

export default EditProduct;
