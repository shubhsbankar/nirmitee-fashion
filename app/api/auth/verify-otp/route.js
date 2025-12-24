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
       
       const loggedInUserData = {
          _id: user._id.toString(),
          role: user.role,
          fullName: user.fullName,
          avatar: user.avatar,
       }
       
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const token = await new SignJWT(loggedInUserData)
            .setIssuedAt()
            .setExpirationTime('24h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret)

      const cookieStore = await cookies();

      cookieStore.set({
         name: 'access_token',
         value: token,
         httpOnly: process.env.NODE_ENV === 'production',
         path: '/',
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
      });

      await storedOtp.deleteOne();

      return response(true,200,"Login successful.", loggedInUserData);


    }
    catch (error) {
       return catchError(error);
    }

}
