import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CategoryModel from '@/models/category.model';
import { categorySchema } from '@/lib/zodSchema'; 

export async function POST(request) {
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
         const {name, slug} = validate.data;
         const newCategory  = new CategoryModel({
           name, slug
         });
         await newCategory.save();
        return response(true,200,"Category added successful");

    }
    catch (error) {

        return catchError(error);
    }
}
