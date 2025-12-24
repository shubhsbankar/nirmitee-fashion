import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ProductModel from '@/models/product.model';
import mongoose from 'mongoose';

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

         const product = await ProductModel.find({_id: { $in: ids }}).lean();
         
         if (!product.length){
             return response(false, 404, 'Data not found.');
         }
         
         if (!['SD','RSD'].includes(deleteType)){
             return response(false, 400, 'Invalid delete operation. Delete type should be SD or RSD for this route.');
         }

         if (deleteType === 'SD') {
             await ProductModel.updateMany({_id : { $in : ids}}, 
                                         {$set: {deletedAt : new Date().toISOString()}});
         }else {
             await ProductModel.updateMany({_id : { $in : ids}}, 
                                         {$set: {deletedAt : null}});
         }

        return response(true,200,deleteType === 'SD' ? "product moved to trash successfully." 
            : "product restored successfully.");

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

         const product = await ProductModel.find({_id: { $in: ids }}).lean();
         
         if (!product.length){
             return response(false, 404, 'Data not found.');
         }
         
         if (!(deleteType === 'PD')){
             return response(false, 400, 'Invalid delete operation. Delete type should be PD for this route.');
         }

         await ProductModel.deleteMany({_id : {$in : ids}});


        return response(true,200,"product deleted permanently");

    }
    catch (error) {
       return catchError(error);
    }
}
