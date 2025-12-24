import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ProductModel from '@/models/product.model';

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

         const product = await ProductModel.find(filter).sort({ createdAt: -1}).select('-media -description').lean();
         if (!product){
        return response(false,404,"Collection empty.");
         }


 

        return response(true,200,"Product found.",product);

    }
    catch (error) {

        return catchError(error);
    }
}
