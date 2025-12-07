import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CouponModel from '@/models/coupon.model';

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

         const coupon = await CouponModel.find(filter).sort({ createdAt: -1}).lean();
         if (!coupon){
        return response(false,404,"Collection empty.");
         }


 

        return response(true,200,"Coupon found.",coupon);

    }
    catch (error) {

        return catchError(error);
    }
}
