import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CouponModel from '@/models/coupon.model';
import { couponSchema } from '@/lib/zodSchema'; 
import { isValidObjectId } from 'mongoose';


export async function PUT(request) {
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
            console.log(validate.error)
             return response(false, 400, 'Invalid or missing field',validate.error);
         }
         const {_id,code, minShoppingAmount, validity, discountPercentage} = validate.data;
         
        if(!isValidObjectId(_id)) {
            return response(false, 400, 'Invalid object id');
        }

         const coupon = await CouponModel.findOne({deletedAt: null, _id })
         if (!coupon){
             return response(false,404,"Coupon not found");
         }

         coupon.code = code;
         coupon.minShoppingAmount = minShoppingAmount;
         coupon.validity = validity;
         coupon.discountPercentage = discountPercentage;
         await coupon.save();
        return response(true,200,"Coupon updated successful");

    }
    catch (error) {

        return catchError(error);
    }
}
