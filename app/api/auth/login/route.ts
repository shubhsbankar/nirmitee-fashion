import { response, 
         catchError, 
         sendEmailVerificationLink, 
         generateOtp } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import { loginSchema } from '@/lib/zodSchema'
import UserModel from '@/models/user.model';
import OTPModel from '@/models/otp.model';
import { sendMail } from '@/lib/sendMail';
import { otpEmail } from '@/email/otpEmail'

export async function POST(request) {
    try {
         await connectDB();
         const payload = await request.json();
         
         if (!payload) {
             return response(false, 400, "Missing params");
         }

         const validatedData = loginSchema.safeParse(payload);
        
         if (!validatedData) {
             return response(false, 400, "Invalid input.");
         }

        console.log("********validatedData*******",validatedData);
         const { email, password } = validatedData.data;
         const user = await UserModel.findOne({ deletedAt: null, email }).select("+password");

         if (!user) {
             return response(false,404,"Invalid login credentials.");
         }
        console.log("********User*******",user);

         if (!user.isEmailVerified) {
             sendEmailVerificationLink(user._id,email);
             return response(false, 400, "Your email is not verified. We have sent a verification link is sent to your registerd email address.");
         }

         const isPasswordVerified = await user.comparePassword(password);
         
         if (!isPasswordVerified) {
             return response(false,400,"Invalid login credentials.");
         }
         
         // Deleting all previous otps if requested within 10 mins
         await OTPModel.deleteMany( {email});
         
         const otp = generateOtp();

         const newOtp = new OTPModel({email, otp});

         await newOtp.save();

         const otpEmailStatus = await sendMail("Your login verification code",email,otpEmail(otp));

         if (!otpEmailStatus) {
             return response(false, 500,'Failed to send otp');
         }

         return response(true,200,"Please verify your device");

    }
    catch (error) {
        return catchError(error);
    }
}
