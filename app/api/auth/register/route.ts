import connectDB from '@/lib/dbConnect';
import {signupSchema } from '@/lib/zodSchema'
import { response, catchError } from '@/lib/helperFunctions'
import { TextEncoder } from 'util';
import UserModel from '@/models/user.model'
import { SignJWT } from 'jose';
import { sendMail } from '@/lib/sendMail'
import { emailVerificationLink }  from '@/email/emailVerification'

export async function POST(request){

    try{
        await connectDB();
        const validateSchema = signupSchema.pick({
            email : true,
            password: true,
            fullName: true
        });

        const data = await request.json();

        const validatedData = validateSchema.safeParse(data);
        
        if (!validatedData.success){
             return response(false,401,"Invalid or missing input field",validatedData.error);
        }

        const { email, fullName, password } = validatedData.data;

        const checkUser = await UserModel.findOne({ email });

        if (checkUser){
             return response(true,409,"User already registered.");
        }

        const newUser = new UserModel({
            email, fullName, password
        });

        await newUser.save();

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);

        const token = await new  SignJWT ( {userId: newUser._id.toString()} )
                            .setIssuedAt()
                            .setExpirationTime('1h')
                            .setProtectedHeader({alg: 'HS256'})
                            .sign(secret);

        await sendMail('Email verification request from Nirmitee Fashion',email,
                       emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`));

        return response(true, 200, "Registration success, Please verify your email address");
    }  

    catch(error){
        return catchError(error);
    }
}
