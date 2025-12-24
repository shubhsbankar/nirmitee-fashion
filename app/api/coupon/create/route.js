import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CouponModel from '@/models/coupon.model';
import { couponSchema } from '@/lib/zodSchema'; 


export async function POST(request) {
    try {
         const auth = await isAuthenticated('admin');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         const payload = await request.json();
         console.log('payload',payload); 
         const validate = couponSchema.safeParse(payload);
         if(!validate.success) {
             return response(false, 400, 'Invalid or missing field',validate.error);
         }
         const {code, minShoppingAmount, validity, discountPercentage} = validate.data;
         
         const newCoupon  = new CouponModel({
           code, minShoppingAmount, validity, discountPercentage
         });
         await newCoupon.save();
        return response(true,200,"Coupon added successful");

    }
    catch (error) {

        return catchError(error);
    }
}
