import { response, 
         catchError } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ReviewModel from '@/models/review.model';
import { reviewSchema } from '@/lib/zodSchema'; 
import mongoose from 'mongoose';

export async function GET(request) {
    try {
        await connectDB();
        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('productId');
        if (!productId) {
            return response(false,400,"Product Id Missing");
        }

  
        let matchQuery = {
            deletedAt: null,
            product: new mongoose.Types.ObjectId(productId)

        };

        const aggregation = [
            {
                $match: matchQuery
            },
            {
                $group: {
                    _id: '$rating',
                    count: {$sum : 1}
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
        ]
        const reviews = await ReviewModel.aggregate(aggregation);
        const totalReview = reviews.reduce((sum, r) => sum + r.count, 0);
        const averageRating = totalReview > 0 ?
            (reviews.reduce((sum, r) => sum + r._id * r.count, 0) / totalReview).toFixed(1)
            : '0.0';
        const rating = reviews.reduce((acc, r) => {
            acc[r._id] = r.count;
            return acc;
        }, {});
        
        const percentage = reviews.reduce((acc, r) => {
            acc[r._id] = (r.count / totalReview) * 100;
            return acc;
        },{});
  
        return response(true, 200, "Review details.", {totalReview, averageRating, percentage, rating});

    }
    catch (error) {

        return catchError(error);
    }
}
