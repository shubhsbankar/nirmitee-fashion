import { response, 
         catchError, 
          } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
//import cloudinary from '@/lib/cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
         await connectDB();
         const payload = await request.json();

         if (!payload) {
             return response(false, 400, "Missing params");
         }

         const { paramsToSign } = payload;
         console.log("paramsToSign",paramsToSign);
         const signature = cloudinary.utils.api_sign_request(paramsToSign,
                                   process.env.CLOUDINARY_SECRET_KEY)
         

         return NextResponse.json({ signature });

    }
    catch (error) {
        return catchError(error);
    }
}
