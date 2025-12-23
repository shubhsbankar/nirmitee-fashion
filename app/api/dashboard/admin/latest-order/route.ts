import connectDB from "@/lib/dbConnect";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import OrderModel from "@/models/order.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorised');
        }
        await connectDB();    
        const latestOrders = await OrderModel
            .find({ deletedAt: null })
            .sort({ createdAT: -1 })
            .limit(20)
            .lean();

        return response(true, 200, 'Data found.', latestOrders);
        
    } catch (error) {
        return catchError(error);
    }
}