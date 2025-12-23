import connectDB from "@/lib/dbConnect";
import { catchError, response } from "@/lib/helperFunctions";
import OrderModel from "@/models/order.model";
import '@/models/product.model';
import '@/models/productVariant.model';
import '@/models/media.model';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { orderid } = await params;

        if (!orderid) {
            return response(false, 400, 'Missing or invalid fields.');
        }

        const orderData = await OrderModel
            .findOne({ order_id: orderid })
            .populate('products.productId', 'name slug')
            .populate({ path: 'products.variantId', populate: { path: 'media' } })
            .lean();
        if (!orderData) {
            return response(false, 404, 'Order data not found.');
        }
        return response(true, 200, 'Order data found.', orderData);

    } catch (error) {
        return catchError(error);
    }
}