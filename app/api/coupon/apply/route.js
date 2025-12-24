import connectDB from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helperFunctions";
import { applyCouponSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/coupon.model";

export async function POST(request) {
    try {
        await connectDB();
        const payload = await request.json();

        const validate = applyCouponSchema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, 'Missing or invalid data', validate.error);
        }
        const { code, minShoppingAmount } = validate.data;

        const couponData = await CouponModel.findOne({ code }).lean();
        if (!couponData) {
            return response(false, 400, 'Invalid or expired coupon code.');
        }

        if (new Date() > couponData.validity) {
            return response(false, 400, 'Coupon code expired!');
        }

        if (minShoppingAmount < couponData.minShoppingAmount) {
            return response(false, 400, 'In-sufficient shopping amount!');
        }

        return response(true, 200, 'Coupon applied succefully.',{discountPercentage: couponData.discountPercentage})


    } catch (error) {
        return catchError(error);
    }
}