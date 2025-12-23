import connectDB from "@/lib/dbConnect";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import UserModel from "@/models/user.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('user');
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized');
        }

        await connectDB();

        const userId = auth.userId;

        const user = await UserModel.findById(userId).lean();
        if (!user) {
            return response(false, 404, 'User not found');
        }
        return response(true, 200, 'User profile data.', user);

    } catch (error) {
        return catchError(error);
    }
}