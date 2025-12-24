import connectDB from '@/lib/dbConnect';
import { SignJWT } from 'jose';
import { response, catchError } from '@/lib/helperFunctions';
import UserModel from '@/models/user.model';
import OTPModel from '@/models/otp.model';
import { OTPSchema } from '@/lib/zodSchema';
import { cookies } from 'next/headers';

export async function POST(request){
    try {
       await  connectDB();
       
       const payload = await request.json();
       const validatedData = OTPSchema.safeParse(payload);

       if (!validatedData) {
          return response(false, 401, "Invalid input or missing fields.", validatedData.error);
       }

       const { email, otp } = validatedData.data;
       
       const storedOtp = await OTPModel.findOne({email, otp});

       if (!storedOtp) {
          return response(false, 404, "Invalid otp.");
       }
       
       const user = await UserModel.findOne({email});
       
       if (!user) {
          return response(false, 404, "User not found.");
       }
       


      await storedOtp.deleteOne();

      return response(true,200,"OTP verified");


    }
    catch (error) {
       return catchError(error);
    }

}
