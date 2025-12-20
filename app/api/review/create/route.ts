import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ReviewModel from '@/models/review.model';
import { reviewSchema } from '@/lib/zodSchema'; 

export async function POST(request) {
    try {
         const auth = await isAuthenticated('user');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         const payload = await request.json();
         console.log('payload',payload); 
        const validate = reviewSchema.safeParse(payload);
        console.log(validate.error);
         if(!validate.success) {
             return response(false, 400, 'Invalid or missing field',validate.error);
         }
         const {product, userId, title, rating, review} = validate.data;
         const newReview  = new ReviewModel({
           product, user:userId,title, rating, review
         });
         await newReview.save();
        return response(true,200,"Your review submitted successfully.");

    }
    catch (error) {

        return catchError(error);
    }
}
