'use client'
import {  useState, useEffect } from 'react';
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
import { categorySchema } from '@/lib/zodSchema'
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
      label: 'Add Product'
   },
];

const AddProduct = () =>{
  const [ loading, setLoading] = useState<boolean>(false);
  const [ categoryOption, setCategoryOption] = useState([]);
  const {data : getCategory } = useFetch('/api/category?deleteType=SD&&size=10000');
  console.log(getCategory);

  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
     if (getCategory && getCategory.success){
        const data = getCategory.data;
        const options = data.map((cat) => ({label: cat.name, value: cat._id}));
        setCategoryOption(options);
     }
  },[getCategory]); 
  const form = useForm({
        resolver: zodResolver(categorySchema),
    defaultValues: {
       name: "",
       slug : "",
       category:"",
       mrp:"",
       sellingPrice: "",
       discountPercentage: "",
       description: "",
    },
  });

  useEffect(() => {
     const name = form.getValues('name');
     if(name) {
        form.setValue('slug', slugify(name).toLowerCase())
     }
  }, [form.watch('name')]);



  const editor = (event, editor) => {
  const data = editor.getData();
  form.setValue('description',data);
      
  }

  const onSubmit = async (values) => {
    console.log(values);
    setLoading(true);
	try {
		const {data : response } = await axios.post('/api/product/create',values);
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
                 <h4 className='font-semibold text-xl'>Add Product</h4>        
                </CardHeader>
                <CardContent className='pb-5'>
                   <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} >
                      <div className='grid md:grid-cols-2 gap-5'>
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
						  <Input type="number" placeholder="Enter Discount Percentage" {...field} />
						</FormControl>
						<FormMessage />
					  </FormItem>
					)}
				  />
               </div>
            <div className='mb-5 md:col-span-2'>
               <FormLabel className='mb-2'>Description<span className='text-red-500'>*</span></FormLabel>
                        <Editor onChange={editor} />
						<FormMessage />
               </div>
               </div>
                <div className='md:col-span-2 border border rounded p-5 text-center'>
                <MediaModal open={open} setOpen={setOpen} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia}
                isMultiple={true} />
                <div onClick={() => {setOpen(true)}} className='bg-gray-50 dark:bg-card border w-[200px] mx-auto
                  p-5 cursor-pointer'>
                  <span className='semi-bold'>Select Media</span>
                </div>
              </div>
               
               <div className=''>
                 <ButtonLoading type="submit" text="Add Product" loading={loading} className={" cursor-pointer"}/>
               </div>
			</form>
			</Form>

                </CardContent>
            </Card>
        </div>
    );
};

export default AddProduct;
