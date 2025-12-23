import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import OrderModel from '@/models/order.model';

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

         const order = await OrderModel.find(filter).select('-products').sort({ createdAt: -1}).lean();
         if (!order){
        return response(false,404,"Collection empty.");
         }


 

        return response(true,200,"order found.",order);

    }
    catch (error) {

        return catchError(error);
    }
}
