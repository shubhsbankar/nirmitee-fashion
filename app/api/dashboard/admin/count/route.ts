import {
    response,
    catchError,
    isAuthenticated
} from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CategoryModel from '@/models/category.model';
import ProductModel from '@/models/product.model';
import UserModel from '@/models/user.model';
import OrderModel from '@/models/order.model';
export async function GET() {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorised');
        }
        await connectDB();
        const [category, product, customer, order] = await Promise.all([
            CategoryModel.countDocuments({ deletedAt: null }),
            ProductModel.countDocuments({ deletedAt: null }),
            UserModel.countDocuments({ deletedAt: null, role: 'user' }),
            OrderModel.countDocuments({ deletedAt: null })
        ]);

        return response(true, 200, 'Dashboard Count.', {
            category, product, customer, order
        })

    } catch (error) {

        return catchError(error);
    }

}