import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ReviewModel from '@/models/review.model';

export async function GET(request) {
    try {
         const auth = await isAuthenticated('admin');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         
         const filter = {
          deletedAt: null
         }

         const review = await ReviewModel.find(filter).sort({ createdAt: -1}).lean();
         if (!review){
        return response(false,404,"Collection empty.");
         }


 

        return response(true,200,"Coupon found.",review);

    }
    catch (error) {

        return catchError(error);
    }
}
