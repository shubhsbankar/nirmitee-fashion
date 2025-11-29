import connectDB from '@/lib/dbConnect';
import { response, catchError,generateOtp } from '@/lib/helperFunctions';
import UserModel from '@/models/user.model';
import OTPModel from '@/models/otp.model';
import { emailSchema } from '@/lib/zodSchema';
import { otpEmail } from '@/email/otpEmail'
import { sendMail } from '@/lib/sendMail';

export async function POST(request){
    try {
       await  connectDB();
       
       const payload = await request.json();
       console.log(payload);
       const validatedData = emailSchema.safeParse(payload?.email);
       console.log("@@@@@@@@validatedData@@@@@",validatedData);
       if (!validatedData) {
          return response(false, 401, "Invalid  or missing input fields.", validatedData.error);
       }

       const email  = validatedData.data;
       
       console.log("email: ",email); 
       const user = await UserModel.findOne({ deletedAt: null, email});
       console.log("$$$$$$$$$$$User$$$$$$$",user);
       if (!user) {
          return response(false, 404, "User not found.");
       }
       
       await OTPModel.deleteMany({ email });
      const otp = generateOtp();

      const newOtp = new OTPModel({email, otp});

      await newOtp.save();

      const otpEmailStatus = await sendMail("Your login verification code",email,otpEmail(otp));

      if (!otpEmailStatus) {
          return response(false, 500,'Failed to re-send otp');
      }

      return response(true,200,"Please verify your device.");
    }
    catch (error) {
       return catchError(error);
    }

}
