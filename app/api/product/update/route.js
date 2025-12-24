import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ProductModel from '@/models/product.model';
import { productSchema } from '@/lib/zodSchema'; 
import { isValidObjectId } from 'mongoose';
import { encode } from 'entities';

export async function PUT(request) {
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
            console.log(validate.error)
             return response(false, 400, 'Invalid or missing field',validate.error);
         }
         const {_id,name, slug, category, mrp, sellingPrice, description, media, discountPercentage} = validate.data;
         
        if(!isValidObjectId(_id)) {
            return response(false, 400, 'Invalid object id');
        }

         const product = await ProductModel.findOne({deletedAt: null, _id })
         if (!product){
             return response(false,404,"Category not found");
         }

         product.name = name;
         product.slug = slug;
         product.category = category;
         product.mrp = mrp;
         product.sellingPrice = sellingPrice;
         product.description = encode(description);
         product.media = media;
         product.discountPercentage = discountPercentage;
         await product.save();
        return response(true,200,"Product updated successful");

    }
    catch (error) {

        return catchError(error);
    }
}
