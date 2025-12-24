import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CategoryModel from '@/models/category.model';
import { categorySchema } from '@/lib/zodSchema'; 

export async function PUT(request) {
    try {
         const auth = await isAuthenticated('admin');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         const payload = await request.json();
         console.log('payload',payload); 
         const validate = categorySchema.safeParse(payload);
         if(!validate.success) {
             return response(false, 400, 'Invalid or missing field',validate.error);
         }
         const {_id,name, slug} = validate.data;

         const category = await CategoryModel.findOne({deletedAt: null, _id })
         if (!category){
             return response(false,404,"Category not found");
         }

         category.name = name;
         category.slug = slug;
         await category.save();
        return response(true,200,"Category updated successful");

    }
    catch (error) {

        return catchError(error);
    }
}
