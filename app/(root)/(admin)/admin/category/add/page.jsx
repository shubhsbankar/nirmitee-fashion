// 'use client'
// import { useState, useEffect } from 'react';
// import { ADMIN_DASHBOARD, ADMIN_CATEGORY_SHOW } from '@/routes/AdminPanelRoute';
// import BreadCrumb from '@/components/application/admin/BreadCrumb';
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
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Input } from "@/components/ui/input";
// import ButtonLoading from '@/components/application/ButtonLoading';
// import { showToast } from '@/lib/showToast';
// import axios from 'axios';
// import { zodResolver } from "@hookform/resolvers/zod";
// import slugify from 'slugify';

// const breadcrumbData = [
//   {
//     href: ADMIN_DASHBOARD,
//     label: 'Home'
//   },
//   {
//     href: ADMIN_CATEGORY_SHOW,
//     label: 'Category'
//   },
//   {
//     href: '',
//     label: 'Add Category'
//   },
// ];

// const AddCategory = () => {
//   const [loading, setLoading] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(categorySchema),
//     defaultValues: {
//       name: "",
//       slug: "",
//     },
//   });

//   useEffect(() => {
//     const name = form.getValues('name');
//     if (name) {
//       form.setValue('slug', slugify(name).toLowerCase())
//     }
//   }, [form.watch('name')]);


//   const onSubmit = async (values) => {
    
//     setLoading(true);
//     try {
//       const { data: response } = await axios.post('/api/category/create', values);
//       if (!response.success) {
//         throw new Error(response.message);
//       }
      
//       showToast('success', response.message);
//       form.reset();
//     }
//     catch (error) {
      
//       showToast('error', error.message);
//     }
//     finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
//       <BreadCrumb breadcrumbData={breadcrumbData} />
//       <Card className='py-0 rounded shadow-sm'>
//         <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
//           <h4 className='font-semibold text-xl'>Add Category</h4>
//         </CardHeader>
//         <CardContent className='pb-5'>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} >
//               <div className='mb-5'>
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Name</FormLabel>
//                       <FormControl>
//                         <Input type="text" placeholder="Enter category name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className='mb-5'>
//                 <FormField
//                   control={form.control}
//                   name="slug"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Slug</FormLabel>
//                       <FormControl>
//                         <Input type="text" placeholder="Enter category slug" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className='mb-3'>
//                 <ButtonLoading type="submit" text="Add Category" loading={loading} className={" cursor-pointer"} />
//               </div>
//             </form>
//           </Form>

//         </CardContent>
//       </Card>
//     </div>
//   );
// };



// export default AddCategory;

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import slugify from "slugify";
import { addCategorySchema } from "@/lib/zodSchema";
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
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPanelRoute";


/* ------------------------------------------------------------------
   Breadcrumb
------------------------------------------------------------------- */

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
  { href: "", label: "Add Category" },
];


/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------- */

const AddCategory = () => {
  const [loading, setLoading] = useState(false);
  const [parentOptions, setParentOptions] = useState([]);

  const { data: categoryRes } = useFetch(
    "/api/category?deleteType=SD&size=10000"
  );

  const form = useForm({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      isSubcategory: false,
      parentId: undefined,
    },
  });

  const name = useWatch({
    control: form.control,
    name: "name",
  });

  const isSubcategory = useWatch({
    control: form.control,
    name: "isSubcategory",
  });


  /* ---------------------------------------------------------------
     Auto-generate slug
  ---------------------------------------------------------------- */

  useEffect(() => {
    if (name) {
      form.setValue("slug", slugify(name, { lower: true }));
    }
  }, [name]);


  /* ---------------------------------------------------------------
     Clear parent if unchecked
  ---------------------------------------------------------------- */

  useEffect(() => {
    if (!isSubcategory) {
      form.setValue("parentId", undefined);
    }
  }, [isSubcategory]);


  /* ---------------------------------------------------------------
     Prepare parent dropdown
  ---------------------------------------------------------------- */

  useEffect(() => {
    if (categoryRes?.success && Array.isArray(categoryRes.data)) {
      const options = categoryRes.data.map((cat) => ({
        label: cat.name,
        value: String(cat._id),
      }));
      setParentOptions(options);
    }
  }, [categoryRes]);


  /* ---------------------------------------------------------------
     Submit
  ---------------------------------------------------------------- */

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/category/create", values);

      if (!data?.success) {
        throw new Error(data?.message || "Failed to create category");
      }

      showToast("success", data.message);
      form.reset();
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


  /* ---------------------------------------------------------------
     UI
  ---------------------------------------------------------------- */

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="rounded shadow-sm">
        <CardHeader className="border-b">
          <h4 className="font-semibold text-xl">Add Category</h4>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="category-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Subcategory */}
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

              {/* Parent Category */}
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

              {/* Submit */}
              <ButtonLoading
                type="submit"
                loading={loading}
                text="Add Category"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;


