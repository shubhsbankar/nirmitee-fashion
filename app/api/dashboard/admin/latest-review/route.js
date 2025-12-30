import connectDB from "@/lib/dbConnect";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import ReviewModel from "@/models/review.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin');
        console.error('auth', auth);
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorised');
        }
        await connectDB();
         console.error('DbConnected');
        const latestReviews = await ReviewModel
            .find({ deletedAt: null })
            .sort({ createdAt: -1 })
            .populate({
                path: 'product',
                select: 'name media',
                populate: {
                    path: 'media',
                    select: 'secure_url'
                }
            })
            .lean();
        console.error('latestReviews',latestReviews);
        return response(true, 200, 'Latest reviews.', latestReviews);

    } catch (error) {
        return catchError(error);
    }
}