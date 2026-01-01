// 'use client'
// import {  use, useState, useEffect } from 'react';
// import { ADMIN_DASHBOARD, ADMIN_CATEGORY_SHOW } from '@/routes/AdminPanelRoute';
// import BreadCrumb  from '@/components/application/admin/BreadCrumb';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { useForm } from "react-hook-form"
// import { categorySchema } from '@/lib/zodSchema'
// import { Card, CardHeader, CardContent} from '@/components/ui/card';
// import { Input } from "@/components/ui/input";
// import ButtonLoading from '@/components/application/ButtonLoading';
// import { showToast } from '@/lib/showToast';
// import axios from 'axios';
// import { zodResolver } from "@hookform/resolvers/zod";
// import slugify from 'slugify';
// import useFetch from '@/hooks/useFetch';

// const breadcrumbData = [
//    {
//       href:  ADMIN_DASHBOARD,
//       label: 'Home'
//    },
//    {
//       href: ADMIN_CATEGORY_SHOW,
//       label: 'Category'
//    },
//    {
//       href: '',
//       label: 'Edit Category'
//    },
// ];

// const EditCategory = ({params}) =>{
//     const { id } = use(params);
//   const [ loading, setLoading] = useState(false);
//     const { data: categoryData } = useFetch(`/api/category/get/${id}`);

//   const form = useForm({
//         resolver: zodResolver(categorySchema),
//     defaultValues: {
//        _id: id,
//        name: "",
//        slug : "",
//     },
//   });
//   useEffect(()=>{
//      if (categoryData && categoryData.success){
//         const data = categoryData.data;
//         form.reset({
//            name: data?.name,
//            slug: data?.slug,
//            _id: id
//         });
//      }
//   },[categoryData]);
//   useEffect(() => {
//      const name = form.getValues('name');
//      if(name) {
//         form.setValue('slug', slugify(name).toLowerCase())
//      }
//   }, [form.watch('name')]);


//   const onSubmit = async (values) => {

//     setLoading(true);
// 	try {
//        const {data : response } = await axios.put('/api/category/update',values);
// 		if ( !response.success ){
// 			throw new Error(response.message);
// 		}

//         showToast('success',response.message);
// 	}
// 	catch (error) {

//         showToast('error',error.message);
// 	}
// 	finally{
// 		setLoading(false);
//         }
//   }

//     return (
//         <div>
//            <BreadCrumb breadcrumbData={breadcrumbData} />
//          <Card className='py-0 rounded shadow-sm'>
//                 <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
//                  <h4 className='font-semibold text-xl'>Edit Category</h4>        
//                 </CardHeader>
//                 <CardContent className='pb-5'>
//                    <Form {...form}>
// 			 <form onSubmit={form.handleSubmit(onSubmit)} >
//              <div className='mb-5'>
// 				  <FormField
// 					control={form.control}
// 					name="name"
// 					render={({ field }) => (
// 					  <FormItem>
// 						<FormLabel>Name</FormLabel>
// 						<FormControl>
// 						  <Input type="text" placeholder="Enter category name" {...field} />
// 						</FormControl>
// 						<FormMessage />
// 					  </FormItem>
// 					)}
// 				  />
//             </div>
//              <div className='mb-5'>
// 				  <FormField
// 					control={form.control}
// 					name="slug"
// 					render={({ field }) => (
// 					  <FormItem>
// 						<FormLabel>Slug</FormLabel>
// 						<FormControl>
// 						  <Input type="text" placeholder="Enter category slug" {...field} />
// 						</FormControl>
// 						<FormMessage />
// 					  </FormItem>
// 					)}
// 				  />
//             </div>

//                <div className='mb-3'>
//                  <ButtonLoading type="submit" text="Update Category" loading={loading} className={" cursor-pointer"}/>
//                </div>
// 			</form>
// 			</Form>

//                 </CardContent>
//             </Card>
//         </div>
//     );
// };


// export default EditCategory;

"use client";

import { use, useState, useEffect } from "react";
import axios from "axios";
import slugify from "slugify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import BreadCrumb from "@/components/application/admin/BreadCrumb";
import ButtonLoading from "@/components/application/ButtonLoading";
import Select from "@/components/application/select";
import { showToast } from "@/lib/showToast";
import useFetch from "@/hooks/useFetch";
import { addCategorySchema } from "@/lib/zodSchema";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPanelRoute";


const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
  { href: "", label: "Edit Category" },
];


const EditCategory = ({ params }) => {
  // ✅ REQUIRED in Next.js 16+
  const { id } = use(params);
  
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [parentOptions, setParentOptions] = useState([]);

  const { data: categoryRes } = useFetch(`/api/category/get/${id}`);
  const { data: allCategories } = useFetch(
    "/api/category?deleteType=SD&size=10000"
  );

  const form = useForm({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      _id: id,
      name: "",
      slug: "",
      isSubcategory: false,
      parentId: undefined,
    },
  });

  const name = useWatch({ control: form.control, name: "name" });
  const isSubcategory = useWatch({
    control: form.control,
    name: "isSubcategory",
  });


  /* ---------------- Populate Form ---------------- */

  useEffect(() => {
    if (categoryRes?.success) {
      form.reset({
        _id: id,
        name: categoryRes.data?.name || "",
        slug: categoryRes.data?.slug || "",
        isSubcategory: !!categoryRes.data?.parentId,
        parentId: categoryRes.data?.parentId || undefined,
      });
      setSlugTouched(false);
    }
  }, [categoryRes, id, form]);


  /* ---------------- Auto Slug ---------------- */

  useEffect(() => {
    if (name && !slugTouched) {
      form.setValue("slug", slugify(name, { lower: true }));
    }
  }, [name, slugTouched, form]);


  /* ---------------- Clear Parent ---------------- */

  useEffect(() => {
    if (!isSubcategory) {
      form.setValue("parentId", undefined);
    }
  }, [isSubcategory, form]);


  /* ---------------- Parent Options ---------------- */

  useEffect(() => {
    if (allCategories?.success && Array.isArray(allCategories.data)) {
      const options = allCategories.data
        .filter((cat) => String(cat._id) !== id)
        .map((cat) => ({
          label: cat.name,
          value: String(cat._id),
        }));
      setParentOptions(options);
    }
  }, [allCategories, id]);


  /* ---------------- Submit ---------------- */

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.put("/api/category/update", values);

      if (!data?.success) {
        throw new Error(data?.message || "Update failed");
      }

      showToast("success", data.message);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="rounded shadow-sm">
        <CardHeader className="border-b">
          <h4 className="font-semibold text-xl">Edit Category</h4>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          setSlugTouched(true);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isSubcategory"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel>Add as Subcategory</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSubcategory && (
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Category</FormLabel>
                      <FormControl>
                        <Select
                          options={parentOptions}
                          selected={field.value}
                          setSelected={field.onChange}
                          isMulti={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <ButtonLoading
                type="submit"
                loading={loading}
                text="Update Category"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
