import connectDB from '@/lib/dbConnect';
import { jwtVerify } from 'jose';
import { response, catchError } from '@/lib/helperFunctions';
import UserModel from '@/models/user.model'

export async function POST(request){
    try {
       await  connectDB();
       
       const token = await request.json();
       console.log("Hi Token in POST Request : ",token); 
       if(!token) {
           return response(false,400,"Missing token.");
       }
       const secret = new TextEncoder().encode(process.env.SECRET_KEY);
       const decoded = await jwtVerify(token.token, secret);
       const userId = decoded.payload.userId;

       const user = await UserModel.findById(userId);

       if (!user) {
           return response(false,404,'User not found.');
       }
       console.log("Hi, User found ", user.fullName);
       user.isEmailVerified = true;
       await user.save();

       return response(true,200,"Email verification success.")


    }
    catch (error) {
       return catchError(error);
    }

}
