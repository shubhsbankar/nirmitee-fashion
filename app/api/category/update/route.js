import {
  response,
  catchError,
  isAuthenticated,
} from "@/lib/helperFunctions";
import connectDB from "@/lib/dbConnect";
import CategoryModel from "@/models/category.model";
import { addCategorySchema } from "@/lib/zodSchema";
import mongoose from "mongoose";

export async function PUT(request) {
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
      return response(false, 400, "Invalid or missing field", validate.error);
    }

      const { _id, name, slug, isSubcategory, parentId } = validate.data;
      console.log('_id', _id);

    session.startTransaction();

    /* -------------------------------------------------
       1. Find category
    -------------------------------------------------- */

    const category = await CategoryModel.findOne({
      _id,
      deletedAt: null,
    }).session(session);

    if (!category) {
      await session.abortTransaction();
      return response(false, 404, "Category not found");
    }

    /* -------------------------------------------------
       2. Update basic fields
    -------------------------------------------------- */

    category.name = name;
    category.slug = slug;
    await category.save({ session });

    /* -------------------------------------------------
       3. Find current parent (derived)
    -------------------------------------------------- */

    const currentParent = await CategoryModel.findOne({
      subCategories: _id,
      deletedAt: null,
    }).session(session);

    /* -------------------------------------------------
       4. Reconcile hierarchy
    -------------------------------------------------- */

    // Case A: was subcategory → now top-level
    if (currentParent && !isSubcategory) {
      await CategoryModel.findByIdAndUpdate(
        currentParent._id,
        { $pull: { subCategories: _id } },
        { session }
      );
    }

    // Case B: was top-level → now subcategory
    if (!currentParent && isSubcategory && parentId) {
      await CategoryModel.findByIdAndUpdate(
        parentId,
        { $addToSet: { subCategories: _id } },
        { session }
      );
    }

    // Case C: parent changed
    if (
      currentParent &&
      isSubcategory &&
      String(currentParent._id) !== String(parentId)
    ) {
      await CategoryModel.findByIdAndUpdate(
        currentParent._id,
        { $pull: { subCategories: _id } },
        { session }
      );

      await CategoryModel.findByIdAndUpdate(
        parentId,
        { $addToSet: { subCategories: _id } },
        { session }
      );
    }

    await session.commitTransaction();

    return response(true, 200, "Category updated successfully");
  } catch (error) {
    await session.abortTransaction();
    return catchError(error);
  } finally {
    session.endSession();
  }
}
