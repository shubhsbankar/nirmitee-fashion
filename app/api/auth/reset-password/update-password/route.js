import connectDB from '@/lib/dbConnect';
import { response, catchError } from '@/lib/helperFunctions';
import UserModel from '@/models/user.model';
import { loginSchema } from '@/lib/zodSchema';

export async function PUT(request){
    try {
       await  connectDB();
       
       const payload = await request.json();
       
       const validatedData = loginSchema.safeParse(payload);

       if (!validatedData) {
          return response(false, 401, "Invalid input or missing fields.", validatedData.error);
       }

       const { email, password } = validatedData.data;
       
  
       
       const user = await UserModel.findOne({deletedAt: null, email}).select('+password');
       
       if (!user) {
          return response(false, 404, "User not found.");
       }
       

      user.password = password;
      await user.save();

      return response(true,200,"Password updated successfully.");


    }
    catch (error) {
       return catchError(error);
    }

}
