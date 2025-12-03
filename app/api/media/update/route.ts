import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import MediaModel from '@/models/media.model';
import { isValidObjectId } from 'mongoose';
import { mediaEditSchema } from '@/lib/zodSchema';

export async function PUT(request) {
    try {
         console.log('Shubham : ');
         const auth = await isAuthenticated('admin');
         console.log('auth.isAuth : ',auth.isAuth);
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();

        const  payload = await request.json();
        console.log('payload',payload); 
        const validate = mediaEditSchema.safeParse(payload);
        if(!validate.success) {
             return response(false, 400, 'Invalid or missing field');
         }
         const {_id, alt, title} = validate.data;

         if(!isValidObjectId(_id)) {
             return response(false, 400, 'Invalid object id');
         }
         const mediaData = await MediaModel
                                 .findById(_id);
         if (!mediaData){
             return response(false, 404, 'Media not found.');
         }

         mediaData.alt = alt;
         mediaData.title = title;

         await mediaData.save()
 

        return response(true,200,"Media updated successfully.",mediaData);

    }
    catch (error) {

        return catchError(error);
    }
}
