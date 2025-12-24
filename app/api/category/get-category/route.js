import { response, 
         catchError, 
          } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CategoryModel from '@/models/category.model';


export async function GET() {
    try {
         await connectDB();
         


         const data = await CategoryModel
             .find({ deletedAt: null})
                                 .lean();
         if (!data){
             return response(false, 404, 'Category not found.');
         }
 

        return response(true,200,"Category found.",data);

    }
    catch (error) {

        return catchError(error);
    }
}
