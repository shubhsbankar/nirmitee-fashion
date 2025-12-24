import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/dbConnect";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import UserModel from "@/models/user.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('user');
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized');
        }

        await connectDB();

        const userId = auth.userId;
        const formData = await request.formData();
        const file = formData.get('file');
        const user = await UserModel.findById(userId);

        if (!user) {
            return response(false, 404, 'User not found');
        }

        user.fullName = formData.get('fullName');
        user.phone = formData.get('phone');
        user.address = formData.get('address');
        

        if (file) {
            const fileBuffer = await file.arrayBuffer();
            const base64Image = `data:${file.type};base64,${Buffer.from(fileBuffer).toString('base64')}`;
            const uploadFile = await cloudinary.uploader.upload(base64Image, {
                upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
            });

            if (user?.avatar?.public_id) {
                await cloudinary.api.delete_resources([user.avatar.public_id]);
            }

            user.avatar = {
                url: uploadFile.secure_url,
                public_id:uploadFile.public_id
            }
        }
        await user.save();

        return response(true, 200, 'Profile updated successfully.', {
            _id: user._id,
            role: user.role,
            fullName: user.fullName,
            avatar: user.avatar
        });
        
    } catch (error) {
        return catchError(error);
    }
}