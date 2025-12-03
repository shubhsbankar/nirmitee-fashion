
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
import { loginSchema, LoginInput } from '@/lib/zodSchema'
import { Card, CardHeader, CardContent} from '@/components/ui/card';
import { Input } from "@/components/ui/input";

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
   const form = useForm<LoginInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email : "",
      password : ""
    },
  });


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
					name="alt"
					render={({ field }) => (
					  <FormItem>
						<FormLabel>Alt</FormLabel>
						<FormControl>
						  <Input type="text" placeholder="Enter alt" {...field} />
						</FormControl>
						<FormMessage />
					  </FormItem>
					)}
				  />
            </div>
             <div className='mb-5'>
				  <FormField
					control={form.control}
					name="title"
					render={({ field }) => (
					  <FormItem>
						<FormLabel>Title</FormLabel>
						<FormControl>
						  <Input type="text" placeholder="Enter title" {...field} />
						</FormControl>
						<FormMessage />
					  </FormItem>
					)}
				  />
            </div>
              
               <div className='mb-3'>
                 <ButtonLoading type="submit" text="Update Media" loading={loading} className={" cursor-pointer"}/>
               </div>
			</form>
			</Form>

                </CardContent>
            </Card>
        </div>
    );
};

export default AddCategory;
