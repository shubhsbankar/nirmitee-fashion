import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CategoryModel from '@/models/category.model';

export async function GET(request) {
    try {
         const auth = await isAuthenticated('admin');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         
         const filter = {
          deletedAt: null
         }

         const category = await CategoryModel.find(filter).sort({ createdAt: -1}).populate('parent','name').lean();
         if (!category || category.length === 0){
        return response(false,404,"Collection empty.");
         }
//console.log(category)
        
        const newCat = category.map((c) => {
            if (c.parent){
               return {
                ...c,
                parent: c.parent.name || null
               }
               
            }
            return c;
        });

         console.log(newCat)
 
        return response(true,200,"Category found.",newCat);

    }
    catch (error) {

        return catchError(error);
    }
}
