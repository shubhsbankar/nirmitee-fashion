import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ProductVariantModel from '@/models/productVariant.model';
import { productVariantSchema } from '@/lib/zodSchema'; 
import { isValidObjectId } from 'mongoose';

export async function PUT(request) {
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
            console.log(validate.error)
             return response(false, 400, 'Invalid or missing field',validate.error);
         }
         const {_id,product, color, sku, mrp, sellingPrice, stock, media, discountPercentage, size} = validate.data;
         
        if(!isValidObjectId(_id)) {
            return response(false, 400, 'Invalid object id');
        }

         const productVariant = await ProductVariantModel.findOne({deletedAt: null, _id })
         if (!productVariant){
             return response(false,404,"Category not found");
         }

         productVariant.product = product;
         productVariant.color = color;
         productVariant.sku = sku;
         productVariant.mrp = mrp;
         productVariant.sellingPrice = sellingPrice;
         productVariant.stock = stock;
         productVariant.media = media;
         productVariant.discountPercentage = discountPercentage;
         productVariant.size = size;
         await productVariant.save();
        return response(true,200,"Product Variant updated successful");

    }
    catch (error) {

        return catchError(error);
    }
}
