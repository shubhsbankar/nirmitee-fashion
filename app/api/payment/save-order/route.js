import OrderDetails from "@/app/(root)/(website)/order-details/[orderid]/page";
import { orderNotification } from "@/email/orderNotification";
import connectDB from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { orderFormSchema, orderIdSchema } from "@/lib/zodSchema";
import OrderModel from "@/models/order.model";
import Razorpay from 'razorpay';
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import z from "zod";

export async function POST(request) {
    try {
        await connectDB();
        const payload = await request.json();
        const productSchema = z.object({
            productId: z.string().length(24, 'Invalid product id format'),
            variantId: z.string().length(24, 'Invalid variant id format'),
            name: z.string().min(1),
            qty: z.number().min(1),
            sellingPrice: z.number().nonnegative(),
            mrp: z.number().nonnegative(),
        });

        const orderSchema = orderFormSchema.extend({
            userId: z.string().optional(),
            razorpay_payment_id: z.string().min(3, 'Payment id is required'),
            razorpay_order_id: z.string().min(3, 'Order id is required'),
            razorpay_signature: z.string().min(3, 'Signature is required'),
            discount: z.number().nonnegative(),
            couponDiscountAmount: z.number().nonnegative(),
            totalAmount: z.number().nonnegative(),
            subtotal: z.number().nonnegative(),
            products: z.array(productSchema)
        });

        const validate = orderSchema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, 'Invalid or missig fields.', { error: validate.error });
        }
        const validatedData = validate.data;

        const verification = validatePaymentVerification({
            order_id: validatedData.razorpay_order_id,
            payment_id: validatedData.razorpay_payment_id
        }, validatedData.razorpay_signature, process.env.RAZORPAY_KEY_SECRET);
        
        let paymentVerification = false;
        if (verification) {
            paymentVerification = true;
        }

        const newOrder = await OrderModel.create({
            user: validatedData.userId,
            name: validatedData.name,
            email: validatedData.email, 
            phone: validatedData.phone,
            country: validatedData.country,
            state: validatedData.state,
            city: validatedData.city,
            pincode: validatedData.pincode,
            landmark: validatedData.landmark,
            ordernote: validatedData.ordernote,
            products: validatedData.products,
            subtotal: validatedData.subtotal,
            discount: validatedData.discount,
            couponDiscountAmount: validatedData.couponDiscountAmount,
            totalAmount: validatedData.totalAmount,
            status: paymentVerification? 'pending' : 'unverified',
            payment_id: validatedData.razorpay_payment_id,   
            order_id: validatedData.razorpay_order_id,
        });
        try {
            const mailData = {
                order_id: validatedData.razorpay_order_id,
                orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${validatedData.razorpay_order_id }`,
            }
            await sendMail('Order place successfully', validatedData.email,orderNotification(mailData))
        } catch (error) {
            console.log(error);
            
        }
                return response(true, 200, 'Oder placed successfully.');
        
    } catch (error) {
        return catchError(error);
    }
    
}