import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ProductVariantModel from '@/models/productVariant.model';
import { productVariantSchema } from '@/lib/zodSchema'; 

export async function POST(request) {
    try {
         const auth = await isAuthenticated('admin');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         const payload = await request.json();
         console.log('payload',payload); 
         const validate = productVariantSchema.safeParse(payload);
         if(!validate.success) {
             return response(false, 400, 'Invalid or missing field',validate.error);
         }
         const {product, color, sku, mrp, sellingPrice, media, discountPercentage, size, stock} = validate.data;
         const newProductVariant  = new ProductVariantModel({
            product, color, sku, mrp, sellingPrice, media, discountPercentage, size, stock
         });
         await newProductVariant.save();
        return response(true,200,"Product Variant added successful");

    }
    catch (error) {

        return catchError(error);
    }
}
