import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import MediaModel from '@/models/media.model';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request) {
         const payload = await request.json();
    try {
         const auth = await isAuthenticated('admin');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         const newMedia = await MediaModel.insertMany(payload);
         return response(true,200,"Media uploaded successfully.", newMedia);

    }
    catch (error) {
        if (payload && payload.length > 0){
            const publicIds = payload.map(data => data.public_id);
            try {
                await cloudinary.api.delete_resources(publicIds);
            }catch (err){
                error.cloudinary = err;
            }
        }
        return catchError(error);
    }
}
