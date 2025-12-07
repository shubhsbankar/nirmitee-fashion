import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ProductVariantModel from '@/models/productVariant.model';

export async function PUT(request) {
    try {
         const auth = await isAuthenticated('admin');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         const payload = await request.json();

         const ids = payload.ids || [];
         const deleteType = payload.deleteType;

         if (!Array.isArray(ids) || ids.length === 0){
             return response(false, 400, 'Invalid or empty Id list.');
         }

         const productvariant = await ProductVariantModel.find({_id: { $in: ids }}).lean();
         
         if (!productvariant.length){
             return response(false, 404, 'Data not found.');
         }
         
         if (!['SD','RSD'].includes(deleteType)){
             return response(false, 400, 'Invalid delete operation. Delete type should be SD or RSD for this route.');
         }

         if (deleteType === 'SD') {
             await ProductVariantModel.updateMany({_id : { $in : ids}}, 
                                         {$set: {deletedAt : new Date().toISOString()}});
         }else {
             await ProductVariantModel.updateMany({_id : { $in : ids}}, 
                                         {$set: {deletedAt : null}});
         }

        return response(true,200,deleteType === 'SD' ? "Product Variant moved to trash successfully." 
            : "Product Variant restored successfully.");

    }
    catch (error) {

        return catchError(error);
    }
}

export async function DELETE(request) {

    try {
         const auth = await isAuthenticated('admin');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         const payload = await request.json();

         const ids = payload.ids || [];
         const deleteType = payload.deleteType;

         if (!Array.isArray(ids) || ids.length === 0){
             return response(false, 400, 'Invalid or empty Id list.');
         }

         const productvariant = await ProductVariantModel.find({_id: { $in: ids }}).lean();
         
         if (!productvariant.length){
             return response(false, 404, 'Data not found.');
         }
         
         if (!(deleteType === 'PD')){
             return response(false, 400, 'Invalid delete operation. Delete type should be PD for this route.');
         }

         await ProductVariantModel.deleteMany({_id : {$in : ids}});


        return response(true,200,"productvariant deleted permanently");

    }
    catch (error) {
       return catchError(error);
    }
}
