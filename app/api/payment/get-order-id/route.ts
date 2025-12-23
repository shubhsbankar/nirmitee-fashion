import connectDB from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helperFunctions";
import { orderIdSchema } from "@/lib/zodSchema";
import Razorpay from 'razorpay';

export async function POST(request) {
    try {
        await connectDB();
        const payload = await request.json();
        const validate = orderIdSchema.safeParse(payload);

        if (!validate.success) {
            return response(false, 400, 'Missing or invalid amount', validate.error);
        }
        const { amount } = validate.data;

        const razorInstance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const razorOption = {
            amount: Number(amount) * 100,
            currency: 'INR'
        }

        const orderDetails = await razorInstance.orders.create(razorOption);
        const oredr_id = orderDetails.id;

        return response(true, 200, 'Oder Id generated.', oredr_id);
        
    } catch (error) {
        return catchError(error);
    }
    
}