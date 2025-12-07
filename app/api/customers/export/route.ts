import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import UserModel from '@/models/user.model';

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

         const user = await UserModel.find(filter).sort({ createdAt: -1}).lean();
         if (!user){
        return response(false,404,"Collection empty.");
         }


 

        return response(true,200,"Coupon found.",user);

    }
    catch (error) {

        return catchError(error);
    }
}
