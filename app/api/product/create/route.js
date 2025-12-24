import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ProductModel from '@/models/product.model';
import { productSchema } from '@/lib/zodSchema'; 
import { encode } from 'entities';

export async function POST(request) {
    try {
         const auth = await isAuthenticated('admin');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         const payload = await request.json();
         console.log('payload',payload); 
         const validate = productSchema.safeParse(payload);
         if(!validate.success) {
             return response(false, 400, 'Invalid or missing field',validate.error);
         }
         const {name, slug, category, mrp, sellingPrice, description, media, discountPercentage} = validate.data;
         const newDescription = encode(description);
         const newProduct  = new ProductModel({
            name, slug, category, mrp, sellingPrice, description: newDescription, media, discountPercentage
         });
         await newProduct.save();
        return response(true,200,"Product added successful");

    }
    catch (error) {

        return catchError(error);
    }
}
