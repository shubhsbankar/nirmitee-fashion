// import { response, 
//          catchError, 
//          isAuthenticated } from '@/lib/helperFunctions';
// import connectDB from '@/lib/dbConnect';
// import CategoryModel from '@/models/category.model';
// import { categorySchema } from '@/lib/zodSchema'; 

// export async function POST(request) {
//     try {
//          const auth = await isAuthenticated('admin');
//          if (!auth.isAuth){
//              return response(false, 403, 'Unauthorised');
//          }
//          await connectDB();
//          const payload = await request.json();
//          console.log('payload',payload); 
//          const validate = categorySchema.safeParse(payload);
//          if(!validate.success) {
//              return response(false, 400, 'Invalid or missing field',validate.error);
//          }
//          const {name, slug} = validate.data;
//          const newCategory  = new CategoryModel({
//            name, slug
//          });
//          await newCategory.save();
//         return response(true,200,"Category added successful");

//     }
//     catch (error) {

//         return catchError(error);
//     }
// }
import {
  response,
  catchError,
  isAuthenticated,
} from "@/lib/helperFunctions";
import connectDB from "@/lib/dbConnect";
import CategoryModel from "@/models/category.model";
import { addCategorySchema } from "@/lib/zodSchema";
import mongoose from "mongoose";

export async function POST(request) {
  const session = await mongoose.startSession();

  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const payload = await request.json();
    const validate = addCategorySchema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields", validate.error);
    }

    const { name, slug, isSubcategory, parentId } = validate.data;

    session.startTransaction();

    /* ----------------------------------------------------
       1. Create category document
    ---------------------------------------------------- */

    const category = await CategoryModel.create(
      [{ name, slug }],
      { session }
    );

    const categoryId = category[0]._id;

    /* ----------------------------------------------------
       2. If subcategory → link to parent
    ---------------------------------------------------- */

    if (isSubcategory) {
      const parent = await CategoryModel.findById(parentId).session(session);

      if (!parent) {
        await session.abortTransaction();
        return response(false, 404, "Parent category not found");
      }

      await CategoryModel.findByIdAndUpdate(
        parentId,
        { $addToSet: { subCategories: categoryId } },
        { session }
      );
    }

    await session.commitTransaction();

    return response(true, 200, "Category added successfully");
  } catch (error) {
    await session.abortTransaction();
    return catchError(error);
  } finally {
    session.endSession();
  }
}
