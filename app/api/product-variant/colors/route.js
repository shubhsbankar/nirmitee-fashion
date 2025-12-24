import { response, 
         catchError, 
          } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ProductVariantModel from '@/models/productVariant.model';


export async function GET() {
    try {
         await connectDB();
         


         const data = await ProductVariantModel
             .distinct('color')
                                 .lean();
         if (!data){
             return response(false, 404, 'Color not found.');
         }
 

        return response(true,200,"Color found.",data);

    }
    catch (error) {

        return catchError(error);
    }
}
