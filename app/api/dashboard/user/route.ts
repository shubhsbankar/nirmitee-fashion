import connectDB from "@/lib/dbConnect";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import OrderModel from "@/models/order.model";
import '@/models/product.model';
import '@/models/productVariant.model';
import '@/models/media.model';

export async function GET(request) {
    try {
        const auth = await isAuthenticated('user');
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized');
        }

        await connectDB();

        const userId = auth.userId;

        const recentOrders = await OrderModel
            .find({ user: userId })
            .populate('products.productId', 'name slug')
            .populate({ path: 'products.variantId', populate: { path: 'media' } })
            .limit(10)
            .lean();

        const totalOrders = await OrderModel.countDocuments({ user: userId });

        return response(true, 200, 'Dashboard Info.', { recentOrders, totalOrders });

    } catch (error) {
        return catchError(error);
    }
}