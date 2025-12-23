import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import OrderModel from '@/models/order.model';

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

         const order = await OrderModel.find({_id: { $in: ids }}).lean();
         
         if (!order.length){
             return response(false, 404, 'Data not found.');
         }
         
         if (!['SD','RSD'].includes(deleteType)){
             return response(false, 400, 'Invalid delete operation. Delete type should be SD or RSD for this route.');
         }

         if (deleteType === 'SD') {
             await OrderModel.updateMany({_id : { $in : ids}}, 
                                         {$set: {deletedAt : new Date().toISOString()}});
         }else {
             await OrderModel.updateMany({_id : { $in : ids}}, 
                                         {$set: {deletedAt : null}});
         }

        return response(true,200,deleteType === 'SD' ? "order moved to trash successfully." 
            : "order restored successfully.");

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

         const order = await OrderModel.find({_id: { $in: ids }}).lean();
         
         if (!order.length){
             return response(false, 404, 'Data not found.');
         }
         
         if (!(deleteType === 'PD')){
             return response(false, 400, 'Invalid delete operation. Delete type should be PD for this route.');
         }

         await OrderModel.deleteMany({_id : {$in : ids}});


        return response(true,200,"order deleted permanently");

    }
    catch (error) {
       return catchError(error);
    }
}
