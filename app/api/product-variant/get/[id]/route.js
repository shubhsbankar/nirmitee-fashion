import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ProductVariantModel from '@/models/productVariant.model';
import { isValidObjectId } from 'mongoose';

export async function GET(request, { params }) {
    try {
         const auth = await isAuthenticated('admin');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         
         const getParams = await params;
         console.log('getParams : ',getParams);
        if (!getParams){
             return response(false, 400, 'Missing params');
         }
        const id = getParams.id;

         if(!isValidObjectId(id)) {
             return response(false, 400, 'Invalid object id');
         }
         // SD => soft delete, RSD=>restore soft delete, PD=> permenent delete
         let filter = {
             deletedAt : null,
             _id: id
         };
         const data = await ProductVariantModel
                                 .findOne(filter)
                                 .populate('media','_id secure_url')
                                 .populate('product','_id name')
                                 .lean();
         if (!data){
             return response(false, 404, 'Product variant not found.');
         }
 

        return response(true,200,"Product Variant found.",data);

    }
    catch (error) {

        return catchError(error);
    }
}
