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
        const orderStatus = await OrderModel.aggregate([
            {
                $match: {
                    deletedAt: null,
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {count: 1}
            }
        ]);

        return response(true, 200, 'Data found.', orderStatus);
        
    } catch (error) {
        return catchError(error);
    }
}