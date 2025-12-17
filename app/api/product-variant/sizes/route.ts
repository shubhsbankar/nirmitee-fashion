import { response, 
         catchError, 
          } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ProductVariantModel from '@/models/productVariant.model';


export async function GET() {
    try {
         await connectDB();
         


        const data = await ProductVariantModel
            .aggregate([
                {
                    $sort: { _id: 1 }
                },
                {
                    $group: {
                        _id: "$size",
                        first: {$first: "$_id"}
                    }
                },
                {
                    $sort: {
                        first: 1
                    }
                },
                {
                    $project: {_id: 0, size: "$_id"}
                }

            ]);
                                 
         if (!data.length){
             return response(false, 404, 'Size not found.');
        }
        
        const sizes = data.map(item => item.size);
 

        return response(true,200,"Size found.",sizes);

    }
    catch (error) {

        return catchError(error);
    }
}
