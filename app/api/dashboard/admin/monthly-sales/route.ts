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
        const monthlySales = await OrderModel.aggregate([
            {
                $match: {
                    deletedAt: null,
                    status: { $in: ['processing', 'shipped', 'delivered'] }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    totalSales: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        return response(true, 200, 'Data found.', monthlySales);
        
    } catch (error) {
        return catchError(error);
    }
}