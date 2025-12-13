import { response, 
         catchError } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import '@/models/media.model';
import '@/models/category.model';
import ProductModel from '@/models/product.model';

export async function GET() {
    try {
         await connectDB();

         const data = await ProductModel
                                 .find({deletedAt: null})
                                 .populate('media')
                                 .populate('category', '_id name')
                                 .limit(8)
                                 .lean();
         if (!data){
             return response(false, 404, 'Product not found.');
         }
 

        return response(true,200,"Product found.",data);

    }
    catch (error) {

        return catchError(error);
    }
}
