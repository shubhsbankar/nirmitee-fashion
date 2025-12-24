import connectDB from '@/lib/dbConnect';
import {signupSchema } from '@/lib/zodSchema'
import { response, catchError, sendEmailVerificationLink } from '@/lib/helperFunctions'
import { TextEncoder } from 'util';
import UserModel from '@/models/user.model'

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
        
        sendEmailVerificationLink(newUser._id,email);
        
        return response(true, 200, "Registration success, Please verify your email address");
    }  

    catch(error){
        return catchError(error);
    }
}
